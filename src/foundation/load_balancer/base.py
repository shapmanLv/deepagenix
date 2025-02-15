from dataclasses import dataclass
from typing import List, Dict, Optional
import time
import logging
import json
from redis import Redis
from sqlalchemy.orm import Session

@dataclass
class LoadBalancerConfig:
    max_retries: int = 3
    rpm_limit: int = 1000  # 每分钟请求数限制
    tpm_limit: int = 100000  # 每分钟token数限制
    strategy: str = "round_robin"  # 负载均衡策略
    model_selection_strategy: str = "performance_based"  # 模型选择策略
    cache_ttl: int = 300  # 缓存时间（秒）
    last_used_index: int = 0  # 上一次使用的key索引

class BaseLoadBalancer:
    def __init__(self, 
                 api_keys: List[str], 
                 config: LoadBalancerConfig,
                 db: Session,
                 redis_client: Redis):
        self.logger = logging.getLogger(__name__)
        self.config = config
        self.db = db
        self.redis_client = redis_client
        self.keys = {key: {
            "success_count": 0,
            "failure_count": 0,
            "last_used": 0,
            "token_usage": 0,
            "disabled_until": 0
        } for key in api_keys}
        
        # 初始化策略
        self._strategy_impl = self._get_strategy_implementation()

    def _get_strategy_implementation(self):
        """根据配置返回具体的策略实现方法"""
        strategies = {
            "round_robin": self._round_robin_strategy,
            "random": self._random_strategy,
            "least_used": self._least_used_strategy,
            "performance_based": self._performance_based_strategy
        }
        return strategies.get(self.config.strategy, self._round_robin_strategy)

    def _get_model_performance_cache(self, model_id: str) -> dict:
        """从缓存获取模型性能指标"""
        cache_key = f"model_perf:{model_id}"
        cached_data = redis_client.get(cache_key)
        return json.loads(cached_data) if cached_data else {}

    def _performance_based_strategy(self) -> Optional[str]:
        """性能优先策略"""
        from src.foundation.models.crud import ModelCRUD
        
        # 获取可用模型列表
        available_models = ModelCRUD(self.db).get_active_models("llm")
        
        # 评估模型性能
        scored_models = []
        for model in available_models:
            perf_data = self._get_model_performance_cache(model.id)
            score = perf_data.get('throughput', 0) * 0.6 + \
                    perf_data.get('accuracy', 0) * 0.4 - \
                    perf_data.get('latency', 0) * 0.2
            scored_models.append((model.id, score))
        
        # 选择最高分的模型
        if not scored_models:
            return None
            
        best_model = max(scored_models, key=lambda x: x[1])
        return best_model[0]

    def get_next_key(self) -> Optional[str]:
        """获取下一个可用API密钥"""
        return self._strategy_impl()

    def update_key_stats(self, key: str, success: bool, token_used: int):
        """更新密钥使用统计"""
        if key not in self.keys:
            return
            
        stats = self.keys[key]
        stats["token_usage"] += token_used
        stats["last_used"] = time.time()
        
        if success:
            stats["success_count"] += 1
        else:
            stats["failure_count"] += 1
            # 失败时临时禁用密钥（5分钟）
            stats["disabled_until"] = time.time() + 300

    def reset_rate_limits(self):
        """每分钟重置速率限制计数器"""
        current_time = time.time()
        for key, stats in self.keys.items():
            if current_time > stats["disabled_until"]:
                stats["token_usage"] = 0

    def _is_key_available(self, key: str) -> bool:
        """检查密钥是否可用"""
        stats = self.keys[key]
        return (
            stats["token_usage"] < self.config.tpm_limit and
            time.time() > stats["disabled_until"]
        )

    def _round_robin_strategy(self) -> Optional[str]:
        """轮询策略实现"""
        available_keys = [k for k in self.keys if self._is_key_available(k)]
        if not available_keys:
            return None
            
        self.last_used_index = (self.last_used_index + 1) % len(available_keys)
        return available_keys[self.last_used_index]

    def _random_strategy(self) -> Optional[str]:
        """随机选择策略"""
        import random
        available_keys = [k for k in self.keys if self._is_key_available(k)]
        return random.choice(available_keys) if available_keys else None

    def _least_used_strategy(self) -> Optional[str]:
        """最少使用策略"""
        available_keys = [k for k in self.keys if self._is_key_available(k)]
        if not available_keys:
            return None
            
        return min(available_keys, key=lambda k: self.keys[k]["success_count"])

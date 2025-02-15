import logging
import time
from typing import Optional, Dict, Any
from functools import wraps
from .load_balancer.base import BaseLoadBalancer, LoadBalancerConfig

class OpenAIRequestError(Exception):
    def __init__(self, message: str, key: str, status_code: int = None):
        super().__init__(message)
        self.key = key
        self.status_code = status_code

def rate_limiter(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        current_key = self.load_balancer.get_next_key()
        if not current_key:
            raise OpenAIRequestError("No available API keys", key="")
            
        attempt = 0
        max_retries = self.load_balancer.config.max_retries
        while attempt <= max_retries:
            try:
                response = func(self, *args, **kwargs, current_key=current_key)
                self.load_balancer.update_key_stats(current_key, True, response.get('usage', {}).get('total_tokens', 0))
                return response
            except OpenAIRequestError as e:
                self.logger.warning(f"API请求失败 (密钥: {e.key}): {e}")
                self.load_balancer.update_key_stats(e.key, False, 0)
                current_key = self.load_balancer.get_next_key()
                if not current_key:
                    raise OpenAIRequestError("所有密钥均不可用", key="")
                attempt += 1
                time.sleep(2 ** attempt)  # 指数退避
        raise OpenAIRequestError(f"超过最大重试次数 ({max_retries})", key=current_key)
    return wrapper

class OpenAIClient:
    def __init__(self, load_balancer: BaseLoadBalancer):
        self.load_balancer = load_balancer
        self.logger = logging.getLogger(__name__)
        self._setup_rate_limiter()

    def _setup_rate_limiter(self):
        """初始化速率限制定时任务"""
        # 实际项目应使用APScheduler或Celery beat
        import threading
        def reset_counter():
            while True:
                time.sleep(60)
                self.load_balancer.reset_rate_limits()
        thread = threading.Thread(target=reset_counter, daemon=True)
        thread.start()

    @rate_limiter
    def chat_completion(self, 
                       messages: list,
                       model: str = "gpt-3.5-turbo",
                       temperature: float = 0.7,
                       current_key: str = None) -> Dict[str, Any]:
        """带负载均衡的聊天补全接口"""
        import openai
        
        openai.api_key = current_key
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                temperature=temperature
            )
            return {
                "content": response.choices[0].message.content,
                "usage": response.usage.to_dict(),
                "model": response.model
            }
        except openai.error.OpenAIError as e:
            status_code = e.http_status if hasattr(e, 'http_status') else 500
            raise OpenAIRequestError(
                f"OpenAI API错误: {str(e)}", 
                key=current_key,
                status_code=status_code
            )

import pytest
from src.foundation.load_balancer.base import BaseLoadBalancer, LoadBalancerConfig


class TestBaseLoadBalancer:
    @pytest.fixture
    def balancer(self):
        keys = ["key1", "key2", "key3"]
        config = LoadBalancerConfig(strategy="round_robin")
        return BaseLoadBalancer(keys, config)

    def test_round_robin_strategy(self, balancer):
        # 测试轮询策略顺序
        assert balancer.get_next_key() == "key1"
        assert balancer.get_next_key() == "key2"
        assert balancer.get_next_key() == "key3"
        assert balancer.get_next_key() == "key1"

    def test_key_availability(self, balancer):
        # 测试密钥禁用逻辑
        balancer.update_key_stats("key1", False, 0)
        assert balancer.get_next_key() == "key2"

    def test_token_usage_tracking(self, balancer):
        # 测试token使用统计
        balancer.update_key_stats("key1", True, 100)
        assert balancer.keys["key1"]["token_usage"] == 100

    def test_rate_limit_reset(self, balancer):
        # 测试速率限制重置
        balancer.keys["key1"]["token_usage"] = 1000
        balancer.reset_rate_limits()
        assert balancer.keys["key1"]["token_usage"] == 0


class TestLoadBalancerStrategies:
    @pytest.fixture(params=["round_robin", "random", "least_used"])
    def strategy_balancer(self, request):
        keys = ["key1", "key2", "key3"]
        config = LoadBalancerConfig(strategy=request.param)
        return BaseLoadBalancer(keys, config)

    def test_strategy_distribution(self, strategy_balancer):
        # 测试不同策略的密钥分配
        keys = set()
        for _ in range(10):
            key = strategy_balancer.get_next_key()
            if key:
                keys.add(key)
        assert len(keys) > 0

    def test_failure_handling(self, strategy_balancer):
        # 测试失败处理逻辑
        strategy_balancer.update_key_stats("key1", False, 0)
        strategy_balancer.update_key_stats("key2", False, 0)
        strategy_balancer.update_key_stats("key3", False, 0)
        assert strategy_balancer.get_next_key() is None

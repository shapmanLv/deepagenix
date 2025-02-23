import unittest
from time import sleep
from src.common.cache.memory import MemoryCache
from src.common.cache.redis import RedisCache


# 基础缓存测试类，所有缓存测试类都应继承此类
class BaseCacheTestCase(unittest.TestCase):
    client_type = None  # 在基类中定义client_type

    def setUp(self):
        self.cache_client = None
        # 根据客户端类型选择缓存类型
        if self.client_type == "memory":
            self.cache_client = MemoryCache()  # 内存缓存
        elif self.client_type == "redis":
            # Redis缓存，并连接到指定的Redis服务器
            self.cache_client = RedisCache(connection_string="redis://localhost:6379/1")
            self.cache_client.clear()  # 清空缓存

    def tearDown(self):
        # 清理缓存客户端中的数据
        if self.cache_client:
            self.cache_client.clear()


# 内存缓存测试类
class MemoryCacheTestCase(BaseCacheTestCase):
    client_type = "memory"  # 设置为内存缓存客户端


# Redis缓存测试类
class RedisCacheTestCase(BaseCacheTestCase):
    client_type = "redis"  # 设置为Redis缓存客户端


# 缓存实现的测试集
class TestCacheImplementations:
    class BasicOperationsTests(BaseCacheTestCase):
        def test_basic_operations(self):
            # 测试 set 和 get 操作
            self.cache_client.set("key1", "value1")  # 设置键值对
            self.assertEqual(
                self.cache_client.get("key1"), "value1"
            )  # 验证获取值是否正确

            # 测试删除操作
            self.cache_client.delete("key1")  # 删除键值对
            self.assertIsNone(self.cache_client.get("key1"))  # 验证删除后无法获取值

        def test_ttl_expiration(self):
            # 测试缓存的 TTL (生存时间) 过期
            self.cache_client.set("temp_key", "temp_value", ttl=1)  # 设置1秒过期的缓存
            self.assertEqual(
                self.cache_client.get("temp_key"), "temp_value"
            )  # 验证缓存设置成功
            sleep(1.1)  # 等待超过TTL时间
            self.assertIsNone(self.cache_client.get("temp_key"))  # 验证缓存已过期

        def test_exists_clear(self):
            # 测试缓存是否存在和清除缓存
            self.cache_client.set("key2", "value2")  # 设置键值对
            self.assertTrue(self.cache_client.exists("key2"))  # 验证键是否存在
            self.cache_client.clear()  # 清空缓存
            self.assertFalse(self.cache_client.exists("key2"))  # 验证清空后键已不存在

    class RedisSpecificTests(BaseCacheTestCase):
        client_type = "redis"  # 子类设置client_type为'redis'

        @unittest.skipUnless("redis" == client_type, "仅适用于Redis的测试")
        def test_redis_serialization(self):
            # 测试 Redis 对 None 值的处理
            self.cache_client.set("null_key", None)  # 设置 None 值
            self.assertIsNone(self.cache_client.get("null_key"))  # 验证获取结果为 None

            # 测试 Redis 存储复杂对象
            test_obj = {"a": 1, "b": [2, 3]}  # 复杂对象
            self.cache_client.set("obj_key", test_obj)  # 设置对象到缓存
            self.assertEqual(
                self.cache_client.get("obj_key"), test_obj
            )  # 验证获取到的对象正确

        def test_unserializable_data(self):
            if isinstance(self.cache_client, MemoryCache):
                # 内存缓存可以存储任何对象
                self.cache_client.set("lambda", lambda x: x + 1)  # 存储一个 lambda 函数
                self.assertTrue(
                    callable(self.cache_client.get("lambda"))
                )  # 验证获取的对象是可调用的
            else:
                # Redis 不能处理不可序列化的对象（如 lambda 函数）
                with self.assertRaises(Exception):
                    self.cache_client.set(
                        "lambda", lambda x: x + 1
                    )  # 存储 lambda 函数，预期抛出异常


# 创建测试套件，针对不同的缓存客户端
def load_tests(loader, tests, pattern):
    suite = unittest.TestSuite()
    # 针对每种缓存客户端创建测试
    for client_cls in [MemoryCacheTestCase, RedisCacheTestCase]:
        for test_class in [
            TestCacheImplementations.BasicOperationsTests,
            TestCacheImplementations.RedisSpecificTests,
        ]:
            tests = loader.loadTestsFromTestCase(test_class)
            for test in tests:
                test.client_type = (
                    client_cls.client_type
                )  # 设置当前测试的缓存客户端类型
            suite.addTests(tests)  # 将测试添加到测试套件
    return suite


if __name__ == "__main__":
    try:
        unittest.main()
    except SystemExit as e:
        print(f"Test result: {e.code}")

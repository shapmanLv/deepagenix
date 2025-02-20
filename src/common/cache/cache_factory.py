from .memory import MemoryCache
from .redis import RedisCache
from ..config import settings


class CacheFactory:
    @staticmethod
    def create_cache(cache_type: str = None) -> MemoryCache | RedisCache:
        """创建缓存实例

        Args:
            cache_type: 缓存类型，支持'memory'和'redis'

        Returns:
            缓存实例

        Raises:
            ValueError: 不支持的缓存类型
        """
        # 如果没指定缓存类型，则从配置文件中读取缓存配置
        if cache_type is None:
            cache_type = settings["cache"]["type"] or "memory"

        if cache_type == "memory":
            return MemoryCache()
        elif cache_type == "redis":
            redis_connection_string = settings["cache"]["redis"]["connection_string"]
            if not redis_connection_string:
                raise ValueError("Redis connection string is required in config")
            return RedisCache(redis_connection_string)
        raise ValueError(f"Unsupported cache type: {cache_type}")

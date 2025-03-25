from typing import Optional, Type, TypeVar
from common.cache.base import BaseCache
from common.cache.redis import RedisCache
from common.config import get_config


T = TypeVar("T")


class CacheFactory:
    @staticmethod
    def create_cache(
        value_type: Type[T], cache_type: Optional[str] = None
    ) -> BaseCache[T]:
        config = get_config()
        # 如果没指定缓存类型，则从配置文件中读取缓存配置
        if cache_type is None:
            cache_type = config["cache"]["type"] or "redis"

        if cache_type == "redis":
            redis_connection_string = config["cache"]["redis"]["connection_string"]
            if not redis_connection_string:
                raise ValueError("Redis connection string is required in config")
            return RedisCache(redis_connection_string)
        raise ValueError(f"Unsupported cache type: {cache_type}")

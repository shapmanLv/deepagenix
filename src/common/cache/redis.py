import redis.asyncio as redis
from .base import BaseCache
from typing import Awaitable, Generic, Optional, TypeVar, cast
import pickle

T = TypeVar("T")


class RedisCache(BaseCache, Generic[T]):
    def __init__(self, connection_string: str):
        from urllib.parse import urlparse

        # 解析连接字符串
        parsed = urlparse(connection_string)
        if parsed.scheme != "redis":
            raise ValueError("Invalid Redis connection string scheme")

        self._client = redis.Redis(
            host=parsed.hostname or "localhost",
            port=parsed.port or 6379,
            db=int(parsed.path.lstrip("/")) if parsed.path else 0,
            password=parsed.password or None,
            decode_responses=False,
        )

    def _serialize(self, value: T) -> bytes:
        if value is None:
            return b"__None__"
        return pickle.dumps(value)

    def _deserialize(self, value: bytes) -> Optional[T]:
        if value == b"__None__":
            return None
        return pickle.loads(value)

    async def get(self, key: str) -> Optional[T]:
        value = await self._client.get(key)
        return self._deserialize(value) if value else None

    async def set(self, key: str, value: T, ttl: Optional[int] = None) -> None:
        serialized = self._serialize(value)
        if ttl is not None:
            await self._client.setex(key, ttl, serialized)
        else:
            await self._client.set(key, serialized)

    async def delete(self, key: str) -> None:
        await self._client.delete(key)

    async def clear(self) -> None:
        await self._client.flushdb()

    async def exists(self, key: str) -> bool:
        return (await self._client.exists(key)) == 1

    async def atomic_get_or_set(
        self, key: str, default_value: T, max_retries=10, ttl: Optional[int] = None
    ) -> T:
        retries = 0
        while retries < max_retries:
            async with self._client.pipeline() as pipe:
                try:
                    # 监视 key
                    await pipe.watch(key)
                    value = await pipe.get(key)
                    value = self._deserialize(value) if value else None

                    if value is None:
                        # 如果 key 不存在，开始事务
                        pipe.multi()
                        # 修复bug：应该序列化 default_value 而非 value（None）
                        serialized = self._serialize(default_value)
                        if ttl is not None:
                            pipe.setex(key, ttl, serialized)
                        else:
                            pipe.set(key, serialized)
                        await pipe.execute()
                        value = default_value

                    await pipe.unwatch()
                    return value
                except redis.WatchError:
                    # 如果监视的 key 被其他客户端修改，则重试
                    retries += 1
                    continue

        raise Exception(
            f"Failed to perform atomic operation after {max_retries} retries"
        )

    async def atomic_increment(self, key: str, ttl: Optional[int] = None) -> int:
        """
        原子性地对 key 的值自增 1，并设置 TTL（如果 key 不存在）。
        :param key: Redis 的 key
        :param ttl: 过期时间（秒），可选
        :return: 自增后的值
        """
        script = """
        local key = KEYS[1]
        local ttl = tonumber(ARGV[1])
        local exists = redis.call('EXISTS', key)
        if exists == 0 then
            redis.call('SET', key, 1)
            if ttl and ttl > 0 then
                redis.call('EXPIRE', key, ttl)
            end
            return 1
        else
            local new_value = redis.call('INCR', key)
            if ttl and ttl > 0 and redis.call('TTL', key) == -1 then
                redis.call('EXPIRE', key, ttl)
            end
            return new_value
        end
        """
        ttl_val = ttl if ttl is not None else 0
        result: str = await cast(
            Awaitable, self._client.eval(script, 1, [key, str(ttl_val)])
        )
        return int(result)

import redis
from .base import BaseCache
from typing import Any, Optional
import pickle


class RedisCache(BaseCache):
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

    def _serialize(self, value: Any) -> bytes:
        if value is None:
            return b"__None__"
        return pickle.dumps(value)

    def _deserialize(self, value: bytes) -> Any:
        if value == b"__None__":
            return None
        return pickle.loads(value)

    def get(self, key: str) -> Optional[Any]:
        value = self._client.get(key)
        return self._deserialize(value) if value else None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        serialized = self._serialize(value)
        if ttl is not None:
            self._client.setex(key, ttl, serialized)
        else:
            self._client.set(key, serialized)

    def delete(self, key: str) -> None:
        self._client.delete(key)

    def clear(self) -> None:
        self._client.flushdb()

    def exists(self, key: str) -> bool:
        return self._client.exists(key) == 1

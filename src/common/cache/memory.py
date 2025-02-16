from .base import BaseCache
from typing import Any, Optional
import time

class MemoryCache(BaseCache):
    def __init__(self):
        self._store = {}
        self._expire_times = {}

    def get(self, key: str) -> Optional[Any]:
        if self.exists(key):
            return self._store[key]
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        self._store[key] = value
        if ttl is not None:
            self._expire_times[key] = time.time() + ttl
        else:
            self._expire_times.pop(key, None)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)
        self._expire_times.pop(key, None)

    def clear(self) -> None:
        self._store.clear()
        self._expire_times.clear()

    def exists(self, key: str) -> bool:
        expire_time = self._expire_times.get(key)
        if expire_time and time.time() > expire_time:
            self.delete(key)
            return False
        return key in self._store

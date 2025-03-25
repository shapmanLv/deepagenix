from abc import ABC, abstractmethod
from typing import Generic, Optional, TypeVar

T = TypeVar("T")


class BaseCache(ABC, Generic[T]):
    @abstractmethod
    async def get(self, key: str) -> Optional[T]:
        pass

    @abstractmethod
    async def set(self, key: str, value: T, ttl: Optional[int] = None) -> None:
        pass

    @abstractmethod
    async def delete(self, key: str) -> None:
        pass

    @abstractmethod
    async def clear(self) -> None:
        pass

    @abstractmethod
    async def exists(self, key: str) -> bool:
        pass

    @abstractmethod
    async def atomic_get_or_set(
        self, key: str, default_value: T, max_retries=10, ttl: Optional[int] = None
    ) -> T:
        pass

    @abstractmethod
    async def atomic_increment(self, key: str, ttl: Optional[int] = None) -> int:
        pass

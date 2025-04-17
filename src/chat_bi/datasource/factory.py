from enum import Enum
from typing import Dict, Type, TypeVar

from chat_bi.datasource.providers.base.schemas import ConnectionSetting


class DataSourceType(Enum):
    MSSQL = 0
    MYSQL = 1
    POSTGRESQL = 2


T = TypeVar("T", bound=ConnectionSetting)


class DataSourceProviderFactory:
    _registry: Dict[DataSourceType, tuple[Type[ConnectionSetting], type]] = {}

    @classmethod
    def register(cls, data_source_type: DataSourceType, setting_cls: Type[T]):
        def decorator(provider_cls: type):
            cls._registry[data_source_type] = (setting_cls, provider_cls)
            return provider_cls

        return decorator

    async def create_provider(self, type: DataSourceType, connection_setting: dict):
        if type not in self._registry:
            raise ValueError(f"Unsupported data source type: {type}")

        setting_cls, provider_cls = self._registry[type]
        setting_instance = setting_cls(**connection_setting)
        return provider_cls(setting_instance)


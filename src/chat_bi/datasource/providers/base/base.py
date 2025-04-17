from abc import ABC
from abc import abstractmethod
from typing import Any
from typing import Generic
from typing import List
from typing import TypeVar

from chat_bi.datasource.providers.base.schemas import (
    ConnectionSetting,
    ConnectionTesting,
    TableFieldMetadata,
    TableMetadata,
    TableType,
)


TConnectionSetting = TypeVar("TConnectionSetting", bound=ConnectionSetting)


class DataSourceProvider(Generic[TConnectionSetting], ABC):
    def __init__(self, connection_setting) -> None:
        super().__init__()
        self.__connection_setting = connection_setting

    @property
    def connection_setting(self):
        return self.__connection_setting

    @abstractmethod
    async def connection_testing(self, **protocol_args: Any) -> ConnectionTesting:
        raise NotImplementedError()

    @abstractmethod
    async def execute_select_sql(self, sql: str, **protocol_args: Any) -> List[dict]:
        raise NotImplementedError()

    @abstractmethod
    async def tables(self, **protocol_args: Any) -> List[TableMetadata]:
        raise NotImplementedError()

    @abstractmethod
    async def fields(
        self, tablename: str, schema: str, type: TableType, **protocol_args: Any
    ) -> List[TableFieldMetadata]:
        raise NotImplementedError()

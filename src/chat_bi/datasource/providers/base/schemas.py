from enum import Enum
from typing import Optional

from pydantic import BaseModel


class TableType(Enum):
    TABLE = "table"
    VIEW = "view"


class ConnectionSetting(BaseModel):
    extra_params: Optional[dict] = None


class SqlConnectionSetting(ConnectionSetting):
    database: str
    port: Optional[int] = None
    user: str
    password: str


class TableMetadata(BaseModel):
    name: str
    type: TableType
    schema: Optional[str] = None
    comment: Optional[str] = None


class TableFieldMetadata(BaseModel):
    name: str
    data_type: str
    comment: Optional[str] = None
    is_primary_key: Optional[bool] = None
    nullable: Optional[bool] = None


class ConnectionTesting(BaseModel):
    is_connection: bool
    error_msg: Optional[str] = None

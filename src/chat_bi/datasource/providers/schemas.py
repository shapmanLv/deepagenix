from typing import Optional

from chat_bi.datasource.providers.base.schemas import ConnectionSetting


class MssqlConnectionSetting(ConnectionSetting):
    database: str
    host: str
    username: str
    password: str
    port: Optional[int] = 1433

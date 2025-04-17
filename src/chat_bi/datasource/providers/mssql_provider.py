from typing import List
from typing import Optional
from urllib.parse import quote_plus

from sqlmodel import text
from sqlmodel.ext.asyncio.session import AsyncSession

from chat_bi.datasource.factory import DataSourceProviderFactory, DataSourceType
from chat_bi.datasource.providers.base.base import DataSourceProvider
from chat_bi.datasource.providers.base.schemas import (
    TableFieldMetadata,
    TableMetadata,
    TableType,
)
from chat_bi.datasource.providers.base.sql_provider import (
    SqlDataSourceProvider,
    auto_session,
)
from chat_bi.datasource.providers.schemas import MssqlConnectionSetting


@DataSourceProviderFactory.register(
    data_source_type=DataSourceType.MSSQL, setting_cls=MssqlConnectionSetting
)
class MssqlDataSourceProvider(
    SqlDataSourceProvider, DataSourceProvider[MssqlConnectionSetting]
):
    def __init__(self, connection_setting: MssqlConnectionSetting) -> None:
        extra_param_items = (
            connection_setting.extra_params.items()
            if connection_setting.extra_params
            else []
        )
        database_url = (
            f"mssql+aioodbc://"
            f"{quote_plus(connection_setting.username)}:"
            f"{quote_plus(connection_setting.password)}@"
            f"{connection_setting.host}:"
            f"{connection_setting.port}/"
            f"{connection_setting.database}"
            "?driver=ODBC+Driver+18+for+SQL+Server"
            f"{'&' if extra_param_items else ''}"
            f"{'&'.join([f'{quote_plus(k)}={quote_plus(v)}' for k, v in extra_param_items])}"
        )
        SqlDataSourceProvider.__init__(self, database_url)
        DataSourceProvider.__init__(self, connection_setting)

    @auto_session
    async def tables(
        self, session: Optional[AsyncSession] = None, **kwargs
    ) -> List[TableMetadata]:
        if session is None:
            raise ValueError()

        query_table = """
                select
                    [schema].name as table_schema,
                    [table].name as table_name,
                    convert(nvarchar(max), isnull([table_property].[value], '')) as table_comment
                from
                    sys.tables [table]
                    inner join sys.schemas [schema]
                        on [table].schema_id = [schema].schema_id
                    left join sys.extended_properties [table_property]
                        on [table].object_id = [table_property].major_id
                        and [table_property].minor_id = 0
            """

        query_view = """
                select
                    [schema].name as table_schema,
                    [table].name as table_name,
                    convert(nvarchar(max), isnull([table_property].[value], '')) as table_comment
                from
                    sys.views [table]
                    inner join sys.schemas [schema]
                        on [table].schema_id = [schema].schema_id
                    left join sys.extended_properties [table_property]
                        on [table].object_id = [table_property].major_id
                        and [table_property].minor_id = 0
            """

        async def build_result(sql: str, type: TableType):
            data = await session.execute(text(sql))
            return [
                TableMetadata(
                    name=row.table_name,
                    type=type,
                    schema=row.table_schema,
                    comment=row.table_comment,
                )
                for row in data
            ]

        result = await build_result(query_table, TableType.TABLE)
        result.extend(await build_result(query_view, TableType.VIEW))

        return result

    @auto_session
    async def fields(
        self,
        tablename: str,
        schema: str,
        type: TableType,
        session: Optional[AsyncSession] = None,
        **kwargs,
    ) -> List[TableFieldMetadata]:
        if session is None:
            raise ValueError()

        async def build_result(sql: str):
            params = {"tablename": tablename, "schema": schema}
            data = await session.execute(text(sql).bindparams(**params))
            return [
                TableFieldMetadata(
                    name=row.column_name,
                    data_type=row.column_type,
                    comment=row.column_comment,
                    is_primary_key=row.is_primary_key,
                    nullable=True if row.is_nullable == 1 else False,
                )
                for row in data
            ]

        if type is TableType.TABLE:
            query_table = """
            select
                [column].name as column_name,
                convert(nvarchar(max), isnull([column_property].[value], '')) as column_comment,
                [column_info].data_type as column_type,
                [column].collation_name as [collation],
                [column].is_nullable,
                [column_info].ordinal_position,
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM sys.indexes AS i
                        INNER JOIN sys.index_columns AS ic
                            ON i.object_id = ic.object_id AND i.index_id = ic.index_id
                        INNER JOIN sys.columns AS c
                            ON i.object_id = c.object_id AND c.column_id = ic.column_id
                        WHERE i.object_id = OBJECT_ID(TABLE_NAME)
                            AND i.is_primary_key = 1
                            AND c.name = COLUMN_NAME
                    ) THEN 1
                    ELSE 0
                END AS is_primary_key
            from
                sys.tables [table]
                inner join sys.schemas [schema]
                    on [table].schema_id = [schema].schema_id
                inner join sys.columns [column]
                    on [table].object_id = [column].object_id
                inner join information_schema.columns [column_info]
                    on [column_info].table_name = [table].name
                    and [column_info].table_name = [table].name
                    and [column_info].table_schema = [schema].name
                    and [column_info].column_name = [column].name
                left join sys.extended_properties [table_property]
                    on [table].object_id = [table_property].major_id
                    and [table_property].minor_id = 0
                left join sys.extended_properties [column_property]
                    on [table].object_id = [column_property].major_id
                    and [column_property].minor_id = [column].column_id
                    and [column_property].class_desc = 'OBJECT_OR_COLUMN'
            where [table].name = :tablename and [schema].name=:schema
            """
            return await build_result(query_table)
        elif type is TableType.VIEW:
            query_view = """
            select
                [column].name as column_name,
                convert(nvarchar(max), isnull([column_property].[value], '')) as column_comment,
                [column_info].data_type as column_type,
                [column].collation_name as [collation],
                    [column].is_nullable,
                    [column_info].ordinal_position,
                    CASE
                        WHEN EXISTS (
                            SELECT 1
                            FROM sys.indexes AS i
                            INNER JOIN sys.index_columns AS ic
                                ON i.object_id = ic.object_id AND i.index_id = ic.index_id
                            INNER JOIN sys.columns AS c
                                ON i.object_id = c.object_id AND c.column_id = ic.column_id
                            WHERE i.object_id = OBJECT_ID(TABLE_NAME)
                                AND i.is_primary_key = 1
                                AND c.name = COLUMN_NAME
                        ) THEN 1
                        ELSE 0
                    END AS is_primary_key
            from
                sys.views [table]
                inner join sys.schemas [schema]
                    on [table].schema_id = [schema].schema_id
                inner join sys.columns [column]
                    on [table].object_id = [column].object_id
                inner join information_schema.columns [column_info]
                    on [column_info].table_name = [table].name
                            and [column_info].table_name = [table].name
                            and [column_info].table_schema = [schema].name
                            and [column_info].column_name = [column].name
                left join sys.extended_properties [table_property]
                    on [table].object_id = [table_property].major_id
                            and [table_property].minor_id = 0
                left join sys.extended_properties [column_property]
                    on [table].object_id = [column_property].major_id
                            and [column_property].minor_id = [column].column_id
                        and [column_property].class_desc = 'OBJECT_OR_COLUMN'
            where [table].name = @tablename and [schema].name=@schema
            """
            return await build_result(query_view)
        else:
            raise Exception(f"未知类型：{type}")

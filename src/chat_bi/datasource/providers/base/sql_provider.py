import inspect
import re
from functools import wraps
from typing import List
from typing import Optional

from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import text
from sqlmodel.ext.asyncio.session import AsyncSession

from chat_bi.datasource.providers.base.schemas import ConnectionTesting


def auto_session(func):
    sig = inspect.signature(func)

    @wraps(func)
    async def wrapper(self, *args, **kwargs):
        if "session" in sig.parameters:
            async with AsyncSession(self.engine) as session:
                try:
                    kwargs["session"] = session
                    return await func(self, *args, **kwargs)
                finally:
                    await session.close()
        else:
            return await func(self, *args, **kwargs)

    return wrapper


class SqlDataSourceProvider:
    def __init__(self, database_url: str) -> None:
        self.__engine = create_async_engine(
            url=database_url,
            echo=False,
            pool_size=100,
            max_overflow=20,
            pool_recycle=3600,
        )

    @property
    def engine(self):
        return self.__engine

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.__engine.dispose()

    @auto_session
    async def connection_testing(
        self, session: Optional[AsyncSession] = None, **kwargs
    ) -> ConnectionTesting:
        if session is None:
            raise ValueError()

        try:
            # 执行原生 SQL 测试（兼容所有数据库）
            result = await session.execute(statement=text("SELECT 1"))
            if result.scalar() == 1:
                return ConnectionTesting(is_connection=True)
            return ConnectionTesting(is_connection=False)
        except Exception as e:
            print(f"数据库连接失败: {str(e)}")
            return ConnectionTesting(is_connection=False, error_msg=str(e))

    @auto_session
    async def execute_select_sql(
        self, sql: str, session: Optional[AsyncSession] = None, **kwargs
    ) -> List[dict]:
        if session is None:
            raise ValueError()

        # 安全校验，没有 select 的话，我就不执行，直接返回空，也不报错
        sanitized_sql = re.sub(r"/\*.*?\*/|--.*", "", sql, flags=re.DOTALL)  # 移除注释
        if not re.match(r"^\s*SELECT\b", sanitized_sql, re.IGNORECASE):
            return []

        # 上面通过正则的方式其实只能拦截理想情况下的，当前我通过事务的方式包着，最终执行回滚来规避
        try:
            result = await session.execute(text(sql))
            await session.rollback()  # 无论是否SELECT都强制回滚
            return [dict(row._mapping) for row in result]
        except Exception as e:
            await session.rollback()
            raise RuntimeError(
                f"sql执行失败，错误信息为: {str(e)}，sql内容为: {sql}"
            ) from e

from sqlalchemy import Column, BigInteger, Boolean, DateTime
from datetime import datetime, timezone
from ..snowflakeId import SnowflakeGenerator


class EntityBase:
    id = Column(BigInteger, primary_key=True, default=SnowflakeGenerator().generate())

    @staticmethod
    def generate_snowflake_id():
        return SnowflakeGenerator().generate()


class SoftDeleteBase:
    deleted = Column(Boolean, default=False, nullable=False, comment="是否已删除")
    deleted_at = Column(DateTime, nullable=True, comment="删除时间")

    def soft_delete(self):
        self.deleted = True
        self.deleted_at = datetime.now(timezone.utc)


class AuditBase:
    created_by = Column(BigInteger, nullable=False, comment="创建者")
    created_at = Column(DateTime, default=datetime.now(timezone.utc), comment="创建时间")
    updated_by = Column(BigInteger, nullable=True, comment="修改者")
    updated_at = Column(DateTime, onupdate=datetime.now(timezone.utc), comment="修改时间")

    def set_creator(self, user_id: int):
        self.created_by = user_id
        self.updated_by = user_id

    def set_updater(self, user_id: int):
        self.updated_by = user_id

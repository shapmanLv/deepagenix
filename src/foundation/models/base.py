from sqlalchemy import Column, BigInteger, Boolean, DateTime, String
from sqlalchemy.ext.declarative import declared_attr
from datetime import datetime
import snowflake

class IDBase:
    """ID基类 提供雪花算法生成ID"""
    id = Column(BigInteger, primary_key=True, default=snowflake.generate_id)
    
    @staticmethod
    def generate_snowflake_id():
        """生成雪花ID的方法"""
        return snowflake.generate_id()

class SoftDeleteBase:
    """软删除基类"""
    deleted = Column(Boolean, default=False, nullable=False, comment="是否删除")
    deleted_at = Column(DateTime, nullable=True, comment="删除时间")

    def soft_delete(self):
        """执行软删除操作"""
        self.deleted = True
        self.deleted_at = datetime.now()

class AuditBase:
    """审计基类"""
    created_by = Column(String(50), comment="创建人")
    created_at = Column(DateTime, default=datetime.now, comment="创建时间")
    updated_by = Column(String(50), comment="修改人")
    updated_at = Column(DateTime, onupdate=datetime.now, comment="修改时间")

    def set_creator(self, user_id: str):
        """初始化创建人信息"""
        self.created_by = user_id
        self.updated_by = user_id

    def set_updater(self, user_id: str):
        """更新修改人信息"""
        self.updated_by = user_id

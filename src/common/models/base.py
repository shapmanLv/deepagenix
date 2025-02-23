from sqlalchemy import Column, BigInteger, Boolean, DateTime, String
from datetime import datetime
import snowflake


class Entity:
    id = Column(BigInteger, primary_key=True, default=snowflake.generate_id)

    @staticmethod
    def generate_snowflake_id():
        return snowflake.generate_id()


class SoftDeleteBase:
    """��ɾ������"""

    deleted = Column(Boolean, default=False, nullable=False, comment="�Ƿ�ɾ��")
    deleted_at = Column(DateTime, nullable=True, comment="ɾ��ʱ��")

    def soft_delete(self):
        """ִ����ɾ������"""
        self.deleted = True
        self.deleted_at = datetime.now()


class AuditBase:
    """��ƻ���"""

    created_by = Column(String(50), comment="������")
    created_at = Column(DateTime, default=datetime.now, comment="����ʱ��")
    updated_by = Column(String(50), comment="�޸���")
    updated_at = Column(DateTime, onupdate=datetime.now, comment="�޸�ʱ��")

    def set_creator(self, user_id: str):
        """��ʼ����������Ϣ"""
        self.created_by = user_id
        self.updated_by = user_id

    def set_updater(self, user_id: str):
        """�����޸�����Ϣ"""
        self.updated_by = user_id

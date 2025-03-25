from sqlmodel import SQLModel, Field, Column, Enum
from enum import Enum as PyEnum
from typing import Optional
from datetime import datetime, timezone
from src.common.models.base import AuditBase, SoftDeleteBase, EntityBase


class ModelType(PyEnum):
    CHAT = 0
    SPEECH = 1
    TEXT_EMBEDDING = 2
    VISION = 3


class ModelApiType(PyEnum):
    OPENAI = 0
    DEEPSEEK = 1


class Models(EntityBase, SoftDeleteBase, AuditBase, SQLModel, table=True):
    """模型表"""
    __tablename__ = "fdn_models"  # type: ignore

    name: str = Field(index=True, max_length=100, description="名称")
    model: str = Field(default="", description="模型")
    endpoint: str = Field(description="模型API接口地址")
    api_key: str = Field(max_length=100, description="api秘钥")
    is_active: bool = Field(default=True, description="是否启用")
    rate_limit: int = Field(default=100, ge=1, description="每分钟最大请求数")
    model_type: ModelType = Field(sa_column=Column(Enum(ModelType)))
    api_format: ModelApiType = Field(sa_column=Column(Enum(ModelApiType)))


class ModelUsageHistory(EntityBase, SQLModel, table=True):
    """模型使用历史表"""
    __tablename__ = "fdn_models_history"  # type: ignore

    trace_id: str = Field(index=True, max_length=64)
    model_id: int = Field(foreign_key="modelregistry.id")
    input_tokens: int = Field(default=0, ge=0)
    output_tokens: int = Field(default=0, ge=0)
    total_tokens: int = Field(default=0, ge=0)
    success: bool = Field(default=True)
    cost: float = Field(default=0.0, ge=0.0)
    latency: float = Field(default=0.0, ge=0.0)
    error_message: Optional[str] = Field(default=None, max_length=500)
    request_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), index=True
    )

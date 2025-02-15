from datetime import datetime
from sqlalchemy import Column, String, Integer, Enum, JSON
from .base import IDBase, SoftDeleteBase, AuditBase
from enum import Enum as PyEnum

class ModelType(PyEnum):
    CHAT = "chat"
    IMAGE = "image"
    EMBEDDING = "embedding"
    AUDIO = "audio"
    VISION = "vision"
    MODERATION = "moderation"
    FINE_TUNED = "fine-tuned"

class ModelStatus(PyEnum):
    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    DEGRADED = "degraded"
    OFFLINE = "offline"

class FoundationModel(IDBase, SoftDeleteBase, AuditBase):
    __tablename__ = 'fdn_model'
      
    name = Column(String(100), nullable=False, comment="")
    api_base = Column(String(500), nullable=False, comment="")
    api_key = Column(String(200), nullable=False, comment="")
    model_type = Column(Enum(ModelType), nullable=False, comment="")
    status = Column(Enum(ModelStatus), default=ModelStatus.ACTIVE, comment="")
    rpm_limit = Column(Integer, default=3000, comment="")
    current_rpm = Column(Integer, default=0, comment="")
    tpm_limit = Column(Integer, default=400000, comment="")
    weight = Column(Integer, default=1, comment="")
    extra_config = Column(JSON, comment="")

class ModelUsage(IDBase):
    __tablename__ = 'fdn_model_usage'
    
    model_id = Column(String(50), nullable=False, comment="")
    user_id = Column(String(50), nullable=False, comment="")
    input_tokens = Column(Integer, default=0, comment="")
    output_tokens = Column(Integer, default=0, comment="")
    usage_type = Column(Enum(ModelType), nullable=False, comment="")
    timestamp = Column(DateTime, default=datetime.now, comment="")
    metadata = Column(JSON, comment="")

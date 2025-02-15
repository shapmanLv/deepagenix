from sqlalchemy.orm import Session
from .model import FoundationModel
from typing import Optional, Dict, Any
import redis
import json

# ��ʼ��Redis����
redis_client = redis.Redis(host='localhost', port=6379, db=0)

class ModelCRUD:
    CACHE_PREFIX = "model:"
    
    def __init__(self, db: Session):
        self.db = db

    def _get_cache_key(self, model_id: str) -> str:
        return f"{self.CACHE_PREFIX}{model_id}"

    def create_model(self, model_data: Dict[str, Any], user_id: str) -> FoundationModel:
        """����ģ�Ͳ����»���"""
        new_model = FoundationModel(**model_data)
        new_model.set_creator(user_id)
        self.db.add(new_model)
        self.db.commit()
        self.db.refresh(new_model)
        
        # ���»���
        cache_key = self._get_cache_key(str(new_model.id))
        redis_client.setex(cache_key, 3600, json.dumps(model_data))
        return new_model

    def get_model(self, model_id: str) -> Optional[FoundationModel]:
        """���ȴӻ����ȡģ��"""
        cache_key = self._get_cache_key(model_id)
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return FoundationModel(**json.loads(cached_data))
            
        model = self.db.query(FoundationModel).filter(
            FoundationModel.id == model_id,
            FoundationModel.deleted == False
        ).first()
        
        if model:
            redis_client.setex(cache_key, 3600, json.dumps(model.__dict__))
        return model

    def update_model(self, model_id: str, update_data: Dict[str, Any], user_id: str) -> Optional[FoundationModel]:
        """����ģ�Ͳ�ͬ������"""
        model = self.get_model(model_id)
        if not model:
            return None
            
        for key, value in update_data.items():
            setattr(model, key, value)
        model.set_updater(user_id)
        
        self.db.commit()
        self.db.refresh(model)
        
        # ���»���
        cache_key = self._get_cache_key(model_id)
        redis_client.setex(cache_key, 3600, json.dumps(model.__dict__))
        return model

    def delete_model(self, model_id: str, user_id: str) -> bool:
        """��ɾ��ģ�Ͳ��������"""
        model = self.get_model(model_id)
        if not model:
            return False
            
        model.soft_delete()
        model.set_updater(user_id)
        self.db.commit()
        
        # ɾ������
        cache_key = self._get_cache_key(model_id)
        redis_client.delete(cache_key)
        return True

    def get_active_models(self, model_type: str) -> list:
        """获取指定类型的可用模型列表"""
        cache_key = f"active_models:{model_type}"
        cached = redis_client.get(cache_key)
        
        if cached:
            return json.loads(cached)
            
        models = self.db.query(FoundationModel).filter(
            FoundationModel.model_type == model_type,
            FoundationModel.is_active == True
        ).all()
        
        if models:
            redis_client.setex(cache_key, 300, json.dumps([m.id for m in models]))
        return models

from typing import Dict, Literal, Type, TypeVar, overload

from foundation.model.executor.providers.base.base import (
    ChatModelExecutor,
    ModelExecutor,
    TextEmbeddingModelExecutor,
)
from foundation.model.models import ModelApiType, ModelType


MODEL_TYPE_BASES = {
    ModelType.CHAT: ChatModelExecutor,
    ModelType.TEXT_EMBEDDING: TextEmbeddingModelExecutor,
}

T = TypeVar("T", bound=ModelExecutor)
KT = TypeVar("KT", ModelType, str)


class ModelExecutorFactory:
    _registry: Dict[ModelType, Dict[ModelApiType, Type[ModelExecutor]]] = {}

    @classmethod
    def register(cls, model_type: ModelType, api_type: ModelApiType):
        def decorator(executor_cls: Type[T]) -> Type[T]:
            base_class = MODEL_TYPE_BASES.get(model_type)
            if not base_class:
                raise ValueError(f"Unregistered model type: {model_type}")

            if not issubclass(executor_cls, base_class):
                raise TypeError(
                    f"{executor_cls.__name__} must be a subclass of "
                    f"{base_class.__name__} for {model_type}"
                )

            # 确保 _registry 里 model_type 存在
            if model_type not in cls._registry:
                cls._registry[model_type] = {}

            # 确保 api_type 不会重复注册
            if api_type in cls._registry[model_type]:
                raise ValueError(
                    f"Combination {model_type.value}+{api_type.value} "
                    f"already registered"
                )

            # ✅ 注册 executor
            cls._registry[model_type][api_type] = executor_cls

            print(f"✅ 注册成功: {executor_cls.__name__} -> {model_type} / {api_type}")
            return executor_cls

        return decorator

    @overload
    @classmethod
    def _create(
        cls,
        model_type: Literal[ModelType.CHAT],
        api_type: ModelApiType,
        endpoint: str,
        api_key: str,
        model: str,
    ) -> ChatModelExecutor: ...

    @overload
    @classmethod
    def _create(
        cls,
        model_type: Literal[ModelType.TEXT_EMBEDDING],
        api_type: ModelApiType,
        endpoint: str,
        api_key: str,
        model: str,
    ) -> TextEmbeddingModelExecutor: ...

    @classmethod
    def _create(
        cls,
        model_type: ModelType,
        api_type: ModelApiType,
        endpoint: str,
        api_key: str,
        model: str,
    ) -> ModelExecutor:
        api_type_dict = cls._registry.get(model_type)
        if api_type_dict is None:
            raise Exception(f"不存在模型类型：{model_type} 对应的 executor 实现")
        executor_cls = api_type_dict.get(api_type)
        if executor_cls is None:
            raise Exception(
                f"模型类型 {model_type} 下不存在符合 {api_type} api格式的 executor 实现"
            )
        return executor_cls(api_base=endpoint, api_key=api_key, model=model, kwargs={})

    @classmethod
    def get_chat_executor(
        cls, model_api_type: ModelApiType, endpoint: str, api_key: str, model: str
    ) -> ChatModelExecutor:
        return cls._create(ModelType.CHAT, model_api_type, endpoint, api_key, model)

    @classmethod
    def get_text_embedding_executor(
        cls, model_api_type: ModelApiType, endpoint: str, api_key: str, model: str
    ) -> TextEmbeddingModelExecutor:
        return cls._create(
            ModelType.TEXT_EMBEDDING, model_api_type, endpoint, api_key, model
        )

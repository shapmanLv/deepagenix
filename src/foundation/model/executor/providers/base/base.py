from abc import ABC, abstractmethod
from typing import Generator
from .schemas import ChatInput, ChatOutput, EmbeddingOutput


class ModelExecutor:
    def __init__(self, api_base: str, api_key: str, model: str, **kwargs):
        self.api_base = api_base
        self.api_key = api_key
        self.model = model


class ChatModelExecutor(ABC, ModelExecutor):
    def __init__(self, api_base: str, api_key: str, model: str, **kwargs):
        super().__init__(api_base=api_base, api_key=api_key, model=model)

    @abstractmethod
    def chat(self, chat_input: ChatInput) -> ChatOutput:
        raise NotImplementedError()

    def chat_stream(self, chat_input: ChatInput) -> Generator[ChatOutput, None, None]:
        raise NotImplementedError()


class TextEmbeddingModelExecutor(ABC, ModelExecutor):
    def __init__(self, api_base: str, api_key: str, model: str, **kwargs):
        super().__init__(api_base=api_base, api_key=api_key, model=model)

    @abstractmethod
    def embedding(self, text: str) -> EmbeddingOutput:
        raise NotImplementedError()

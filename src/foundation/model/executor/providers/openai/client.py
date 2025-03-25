from typing import Generator
import requests

from foundation.model.executor.factory import ModelExecutorFactory
from foundation.model.executor.providers.base.base import (
    ChatModelExecutor,
    TextEmbeddingModelExecutor,
)
from foundation.model.executor.providers.base.schemas import (
    ChatInput,
    ChatOutput,
    ChatUsage,
    EmbeddingOutput,
    EmbeddingUsage,
)
from foundation.model.executor.providers.openai.schemas import (
    ChatRequest,
    ChatResponse,
    EmbeddingRequest,
    EmbeddingResponse,
    Message,
)
from foundation.model.models import ModelApiType, ModelType


@ModelExecutorFactory.register(model_type=ModelType.CHAT, api_type=ModelApiType.OPENAI)
class OpenaiChatModelExecutor(ChatModelExecutor):
    def __init__(self, api_base: str, api_key: str, model: str, **kwargs):
        super().__init__(api_base=api_base, api_key=api_key, model=model)

    def chat(self, chat_input: ChatInput) -> ChatOutput:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        chat_request = ChatRequest(
            model=self.model,
            messages=[
                Message(role=message.role, content=message.content)
                for message in chat_input.messages
            ],
            max_tokens=chat_input.max_tokens,
            temperature=chat_input.temperature,
            top_p=chat_input.top_p,
        )
        response = requests.post(
            f"{self.api_base}/chat/completions",
            headers=headers,
            json=chat_request.model_dump(),
        )
        response.raise_for_status()
        response_content = response.content.decode('utf-8')
        chat_response = ChatResponse.model_validate_json(response_content)
        return ChatOutput(
            content=(
                chat_response.choices[0].message.content or ""
                if chat_response.choices and chat_response.choices[0].message
                else ""
            ),
            reasoning_content=(
                chat_response.choices[0].message.reasoning_content or ""
                if chat_response.choices and chat_response.choices[0].message
                else ""
            ),
            usage=(
                ChatUsage(prompt_tokens=0, completion_tokens=0, total_tokens=0)
                if not chat_response.usage
                else ChatUsage(
                    prompt_tokens=chat_response.usage.prompt_tokens or 0,
                    completion_tokens=chat_response.usage.completion_tokens or 0,
                    total_tokens=chat_response.usage.total_tokens or 0,
                )
            ),
        )

    def chat_stream(self, chat_input: ChatInput) -> Generator[ChatOutput, None, None]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        chat_request = ChatRequest(
            model=self.model,
            messages=[
                Message(role=message.role, content=message.content)
                for message in chat_input.messages
            ],
            max_tokens=chat_input.max_tokens,
            temperature=chat_input.temperature,
            top_p=chat_input.top_p,
            stream=True,
        )
        response = requests.post(
            f"{self.api_base}/chat/completions",
            headers=headers,
            json=chat_request.model_dump(),
        )
        response.raise_for_status()

        buffer = ""
        for chunk in response.iter_content(1024):
            buffer += chunk.decode('utf-8', errors='replace')
            while "\n\n" in buffer:
                event, buffer = buffer.split("\n\n", 1)
                for line in event.split('\n'):
                    line = line.strip()
                    if line.startswith('data:'):
                        payload = line[5:].strip()
                        if payload == '[DONE]':
                            return
                        try:
                            data = ChatResponse.model_validate_json(payload)
                            content = (
                                data.choices[0].delta.content or ""
                                if data.choices and data.choices[0].delta
                                else ""
                            )
                            yield ChatOutput(
                                content=content,
                                usage=(ChatUsage(prompt_tokens=0, completion_tokens=0, total_tokens=0)
                                    if not data.usage
                                    else ChatUsage(
                                        prompt_tokens=data.usage.prompt_tokens or 0,
                                        completion_tokens=data.usage.completion_tokens or 0,
                                        total_tokens=data.usage.total_tokens or 0,
                                    )
                                ), 
                                reasoning_content=None)
                        except Exception as e:
                            print(f"Error processing {payload}: {str(e)}")


@ModelExecutorFactory.register(model_type=ModelType.TEXT_EMBEDDING, api_type=ModelApiType.OPENAI)
class OpenaiTextEmbeddingModelExecutor(TextEmbeddingModelExecutor):
    def __init__(self, api_base: str, api_key: str, model: str, **kwargs):
        super().__init__(api_base=api_base, api_key=api_key, model=model)

    def embedding(self, text: str) -> EmbeddingOutput:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        embedding_request = EmbeddingRequest(
            model=self.model,
            input=text,
        )
        response = requests.post(
            f"{self.api_base}/embeddings",
            headers=headers,
            json=embedding_request.model_dump(),
        )
        response.raise_for_status()
        response_content = response.content.decode('utf-8')
        embedding_response = EmbeddingResponse.model_validate_json(response_content)
        return EmbeddingOutput(
            embedding=(
                embedding_response.data[0].embedding if embedding_response.data else []
            ),
            usage=(
                EmbeddingUsage(
                    prompt_tokens=embedding_response.usage.prompt_tokens or 0,
                    total_tokens=embedding_response.usage.total_tokens or 0,
                )
                if embedding_response.usage
                else EmbeddingUsage(prompt_tokens=0, total_tokens=0)
            ),
        )

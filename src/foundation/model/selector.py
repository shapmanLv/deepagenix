from datetime import datetime, timezone
import random
from typing import List

from common.cache.cache_factory import CacheFactory
from foundation.model.models import Models, ModelApiType, ModelType


class ModelThresholdExceededException(Exception):
    pass


class ModelSelector:
    def __init__(self):
        self._cache = CacheFactory.create_cache(List[Models])

    async def select_model(self, model_type: ModelType) -> Models:
        # 从缓存中获取模型列表
        models = await self._cache.get("models")
        if models:
            models = [model for model in models if model.model_type == model_type and model.is_active]
        if not models:
            raise ValueError("No available models for the specified type")

        # 加权随机算法
        total_weight = sum(model.rate_limit for model in models)
        selected_model = self._weighted_random_selection(models, total_weight)

        # 检查阈值
        if await self._is_threshold_exceeded(selected_model):
            raise ModelThresholdExceededException("Model request threshold exceeded")

        return selected_model

    def _weighted_random_selection(
        self, models: List[Models], total_weight: int
    ) -> Models:
        rand = random.uniform(0, total_weight)
        cumulative_weight = 0
        for model in models:
            cumulative_weight += model.rate_limit
            if rand <= cumulative_weight:
                return model
        raise ModelThresholdExceededException("No model available")

    async def _is_threshold_exceeded(self, model: Models) -> bool:
        # 调用次数自增1，如果自增后没有超过阈值，则说明模型可用
        current_count = await self._cache.atomic_increment(
            f"model:{datetime.now(timezone.utc).strftime("%y%m%d%H%M")}:{model.id}:count",
            ttl=60 * 2,
        )
        return int(current_count) > model.rate_limit
    
if __name__ == "__main__":
    def test_executor():
        from foundation.model.executor.providers.base.schemas import ChatInput, ChatOutput, ChatMessage, ChatUsage
        from foundation.model.executor.factory import ModelExecutorFactory
        from typing import Generator, Optional
        
        executor = ModelExecutorFactory.get_chat_executor(
            model_api_type=ModelApiType.OPENAI,
            endpoint="https://api.siliconflow.cn/v1",
            api_key="sk-qmqshfyeicjdrswtnkkkucnobfpnalufloznshjcbhunppug",
            model="deepseek-ai/DeepSeek-R1"
        )
        
        chat_input=ChatInput([ChatMessage(role="user", content="hello")])
        response = executor.chat(chat_input=chat_input)
        print(f"非流式聊天响应: {response}，token消耗：{response.usage}")
        
        stream_generator: Generator[ChatOutput, None, None] = executor.chat_stream(chat_input=chat_input)
        full_response: List[str] = []
        full_usage: List[Optional[ChatUsage]] = []
        for chunk in stream_generator:
            print(chunk.content, end="", flush=True)
            full_response.append(chunk.content)
            full_usage.append(chunk.usage)
        final_output = "".join(full_response)
        final_usage = [item.total_tokens or 0 if item else 0 for item in full_usage]
        print(f"\n\n流式完整响应：{final_output}，token用量：{sum(final_usage)}")
        
        executor = ModelExecutorFactory.get_text_embedding_executor(
            model_api_type=ModelApiType.OPENAI,
            endpoint="https://api.siliconflow.cn/v1",
            api_key="sk-qmqshfyeicjdrswtnkkkucnobfpnalufloznshjcbhunppug",
            model="BAAI/bge-large-zh-v1.5"
        )
        embedding_response = executor.embedding("hello world")
        print(f"embedding结果为：{embedding_response.embedding}，用量信息：{embedding_response.usage}")
        
        
    test_executor()

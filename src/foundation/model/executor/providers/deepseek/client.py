import re
from typing import Generator
from foundation.model.executor.factory import ModelExecutorFactory
from foundation.model.executor.providers.base.schemas import ChatInput, ChatOutput
from foundation.model.executor.providers.openai.client import OpenaiChatModelExecutor
from foundation.model.models import ModelApiType, ModelType


@ModelExecutorFactory.register(model_type=ModelType.CHAT, api_type=ModelApiType.DEEPSEEK)
class DeepSeekModelExecutor(OpenaiChatModelExecutor):
    def __init__(self, api_base: str, api_key: str, model: str, **kwargs):
        super().__init__(api_base=api_base, api_key=api_key, model=model)

    def chat(self, chat_input: ChatInput) -> ChatOutput:
        output = OpenaiChatModelExecutor.chat(self=self, chat_input=chat_input)
        pattern = re.compile(r'<think>(.*?)</think>', re.DOTALL)
        think_matches = [match.strip() for match in pattern.findall(output.content)]
        think_content = '\n\n'.join(think_matches)
        content = pattern.sub('', output.content).strip()
        output.content = content
        output.reasoning_content = think_content
        return output

    def chat_stream(self, chat_input: ChatInput) -> Generator[ChatOutput, None, None]:
        stream_output: Generator[ChatOutput, None, None] = OpenaiChatModelExecutor.chat_stream(self=self, chat_input=chat_input)
        is_think = False
        for output in stream_output:
            # 匹配 think 标签起始位置
            if '<think>' in output.content:
                is_think = True
                output.reasoning_content = output.content.replace('<think>', '')
                output.content = ''
                continue
            if not is_think:
                continue;
            # 匹配 think 标签结束位置
            if '<think/>' in output.content:
                output.reasoning_content = output.content.replace('<think/>', '')
                output.content = ''
            yield output

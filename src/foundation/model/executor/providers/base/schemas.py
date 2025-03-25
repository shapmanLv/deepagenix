from dataclasses import dataclass
from typing import List, Optional


@dataclass
class ChatMessage:
    role: str  # 角色，如 "user" 或 "assistant"
    content: str  # 消息内容


# Chat 相关
@dataclass
class ChatInput:
    messages: List[ChatMessage]  # 消息列表
    temperature: float = 0.7  # 默认温度
    max_tokens: Optional[int] = None  # 最大 token 数
    top_p: float = 1.0


@dataclass
class ChatUsage:
    prompt_tokens: int  # 输入的 token 数
    completion_tokens: int  # 输出的 token 数
    total_tokens: int  # 总 token 数


@dataclass
class ChatOutput:
    content: str  # 模型生成的响应
    usage: Optional[ChatUsage]  # token 使用情况
    reasoning_content: Optional[str] = None  # 思考模型的思考内容


# Embedding 相关
@dataclass
class EmbeddingUsage:
    prompt_tokens: int  # 输入的 token 数
    total_tokens: int  # 总 token 数


@dataclass
class EmbeddingOutput:
    embedding: List[float]  # Embedding 向量
    usage: EmbeddingUsage  # token 使用情况

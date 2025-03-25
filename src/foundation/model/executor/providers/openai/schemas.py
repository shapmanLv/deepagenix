from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class Message(BaseModel):
    role: Optional[str] = None
    content: Optional[str] = None


class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    stream: bool = False


class Delta(BaseModel):
    content: Optional[str] = None
    reasoning_content: Optional[str] = None
    role: Optional[str] = None

class ChoiceMessage(BaseModel):
    role: Optional[str] = None
    content: Optional[str] = None
    reasoning_content: Optional[str] = None

class Choice(BaseModel):
    index: Optional[int] = None
    message: Optional[ChoiceMessage] = None
    finish_reason: Optional[str] = None
    delta: Optional[Delta] = None


class Usage(BaseModel):
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    total_tokens: Optional[int] = None


class ChatResponse(BaseModel):
    id: Optional[str] = None
    model: Optional[str] = None
    object: Optional[str] = None
    created: Optional[int] = None
    choices: Optional[List[Choice]] = None
    system_fingerprint: Optional[str] = None
    usage: Optional[Usage] = None


class EmbeddingRequest(BaseModel):
    model: str
    input: str


class EmbeddingModel(BaseModel):
    embedding: List[float]


class EmbeddingUsage(BaseModel):
    prompt_tokens: Optional[int] = None
    total_tokens: Optional[int] = None


class EmbeddingResponse(BaseModel):
    data: Optional[List[EmbeddingModel]] = None
    usage: Optional[EmbeddingUsage] = None


class ToolCall(BaseModel):
    name: str
    arguments: Dict[str, Any]


class FunctionCallRequest(BaseModel):
    model: str
    messages: List[Message]
    tools: List[ToolCall]
    tool_choice: Optional[str] = None


class FunctionCallResponse(BaseModel):
    tool_calls: Optional[List[ToolCall]] = None

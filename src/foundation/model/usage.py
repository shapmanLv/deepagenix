from sqlmodel import Session
from .models import ModelUsageRecord


class ModelUsageRecorder:
    def __init__(self, session: Session):
        self.session = session

    def record_usage(
        self,
        model_id: int,
        business_type: str,
        input_tokens: int,
        output_tokens: int,
        is_success: bool,
        trace_id: str,
    ):
        record = ModelUsageRecord(
            model_id=model_id,
            business_type=business_type,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            is_success=is_success,
            trace_id=trace_id,
        )
        self.session.add(record)
        self.session.commit()

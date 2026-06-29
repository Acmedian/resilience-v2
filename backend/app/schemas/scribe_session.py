from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel


class ScribeSessionCreate(BaseModel):
    patient_id: int
    doctor_id: int
    transcript: Optional[str] = None


class ScribeSessionResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    transcript: Optional[str] = None
    summary: Optional[Dict[str, Any]] = None
    recorded_at: datetime

    class Config:
        from_attributes = True


class SummariseRequest(BaseModel):
    transcript: Optional[str] = None

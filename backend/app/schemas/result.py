from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel


class ResultCreate(BaseModel):
    user_id: int
    survey_id: int
    answers: Optional[Dict[str, Any]] = None
    score: Optional[float] = None


class ResultResponse(BaseModel):
    id: int
    user_id: int
    survey_id: int
    answers: Optional[Dict[str, Any]] = None
    score: Optional[float] = None
    submitted_at: datetime

    class Config:
        from_attributes = True

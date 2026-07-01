from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ScreeningOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    type: str
    estimated_minutes: int
    cohort_id: Optional[int] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ScreeningQuestionOut(BaseModel):
    id: int
    text: str
    type: str
    options: Optional[List[Any]] = None
    order_index: int
    is_required: bool

    class Config:
        from_attributes = True


class LastResultOut(BaseModel):
    id: int
    status: str
    score: Optional[float] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MyScreeningItem(BaseModel):
    screening: ScreeningOut
    assignment_status: str
    due_date: Optional[datetime] = None
    last_result: Optional[LastResultOut] = None


class ScreeningDetailOut(BaseModel):
    screening: ScreeningOut
    questions: List[ScreeningQuestionOut]


class StartScreeningRequest(BaseModel):
    voice_mode: bool = False


class StartScreeningResponse(BaseModel):
    result_id: int
    questions: List[ScreeningQuestionOut]
    screening: ScreeningOut


class SubmitScreeningRequest(BaseModel):
    result_id: int
    answers: Dict[str, Any]
    voice_mode: bool = False


class SubmitScreeningResponse(BaseModel):
    score: Optional[float] = None
    screening_title: str
    completed_at: datetime


class ResultQuestionOut(BaseModel):
    id: int
    text: str
    type: str
    options: Optional[List[Any]] = None
    order_index: int
    patient_answer: Optional[Any] = None


class ResultOut(BaseModel):
    id: int
    status: str
    score: Optional[float] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    voice_mode: bool

    class Config:
        from_attributes = True


class ResultDetailOut(BaseModel):
    result: ResultOut
    screening: ScreeningOut
    questions: List[ResultQuestionOut]


class AssignDefaultsResponse(BaseModel):
    created: int

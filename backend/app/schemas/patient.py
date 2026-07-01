from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PatientCreate(BaseModel):
    name: str
    email: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    condition: Optional[str] = None
    cohort_name: Optional[str] = None
    notes: Optional[str] = None


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    condition: Optional[str] = None
    cohort_name: Optional[str] = None
    notes: Optional[str] = None
    risk_status: Optional[str] = None
    is_active: Optional[bool] = None


class LatestScreeningOut(BaseModel):
    screening_title: str
    score: Optional[float] = None
    voice_mode: bool
    completed_at: Optional[datetime] = None


class PatientResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    condition: Optional[str] = None
    clinician_id: Optional[int] = None
    cohort_id: Optional[int] = None
    cohort_name: Optional[str] = None
    notes: Optional[str] = None
    risk_status: str
    is_active: bool
    created_at: datetime
    latest_screening: Optional[LatestScreeningOut] = None

    class Config:
        from_attributes = True


class ScreeningHistoryItem(BaseModel):
    result_id: int
    screening_id: int
    screening_title: str
    score: Optional[float] = None
    voice_mode: bool
    completed_at: Optional[datetime] = None


class ScribeSessionBrief(BaseModel):
    id: int
    status: str
    recorded_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None

    class Config:
        from_attributes = True


class PatientDetailResponse(BaseModel):
    patient: PatientResponse
    screening_history: list[ScreeningHistoryItem]
    scribe_sessions: list[ScribeSessionBrief]

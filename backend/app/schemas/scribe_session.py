from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class TranscriptLine(BaseModel):
    speaker: str  # 'clinician' | 'patient'
    text: str
    timestamp: str


class ScribeSessionCreate(BaseModel):
    patient_id: int


class ScribeSessionCreateResponse(BaseModel):
    session_id: int
    patient_id: int
    patient_name: str
    recorded_at: datetime


class TranscriptAppendRequest(BaseModel):
    lines: List[TranscriptLine]


class SummaryOut(BaseModel):
    chief_complaint: str
    progress: str
    medication_response: str
    mental_state: str
    recommended_followup: str
    session_notes: str


class SummariseResponse(BaseModel):
    summary: Dict[str, Any]
    session_id: int


class ScribeSessionOut(BaseModel):
    id: int
    patient_id: int
    patient_name: str
    clinician_id: int
    transcript: List[TranscriptLine]
    summary: Optional[Dict[str, Any]] = None
    status: str
    duration_seconds: Optional[int] = None
    share_with_patient: bool
    recorded_at: datetime
    completed_at: Optional[datetime] = None


class ScribeSessionListItem(BaseModel):
    id: int
    patient_id: int
    patient_name: str
    status: str
    duration_seconds: Optional[int] = None
    recorded_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ScribeSessionUpdate(BaseModel):
    summary: Optional[Dict[str, Any]] = None
    share_with_patient: Optional[bool] = None

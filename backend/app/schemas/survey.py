from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SurveyCreate(BaseModel):
    name: str
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    unit_id: Optional[int] = None


class SurveyUpdate(BaseModel):
    name: Optional[str] = None
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    unit_id: Optional[int] = None


class SurveyResponse(BaseModel):
    id: int
    name: str
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    unit_id: Optional[int] = None
    created_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

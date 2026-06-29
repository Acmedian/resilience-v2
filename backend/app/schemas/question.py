from typing import Any, List, Optional

from pydantic import BaseModel


class QuestionCreate(BaseModel):
    text: str
    type: str = "multiple_choice"
    category_id: Optional[int] = None
    options: Optional[List[Any]] = None
    correct_answer: Optional[str] = None
    survey_id: Optional[int] = None


class QuestionUpdate(BaseModel):
    text: Optional[str] = None
    type: Optional[str] = None
    category_id: Optional[int] = None
    options: Optional[List[Any]] = None
    correct_answer: Optional[str] = None


class QuestionResponse(BaseModel):
    id: int
    text: str
    type: str
    category_id: Optional[int] = None
    options: Optional[List[Any]] = None
    correct_answer: Optional[str] = None
    survey_id: Optional[int] = None

    class Config:
        from_attributes = True


class GenerateQuestionsRequest(BaseModel):
    topic: str
    count: int = 5
    type: str = "multiple_choice"

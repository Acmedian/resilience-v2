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


class GenerateScreeningQuestionsRequest(BaseModel):
    topic: str
    question_type: Optional[str] = None  # mcq | rating | fill | truefalse
    count: int = 5
    screening_id: Optional[int] = None


class GeneratedQuestionOut(BaseModel):
    text: str
    type: str
    options: Optional[List[str]] = None
    suggested_answer: Optional[str] = None


class ApprovedQuestionIn(BaseModel):
    text: str
    type: str
    options: Optional[List[str]] = None
    suggested_answer: Optional[str] = None


class ApproveQuestionsRequest(BaseModel):
    screening_id: int
    questions: List[ApprovedQuestionIn]

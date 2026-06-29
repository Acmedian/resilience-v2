from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.question import Question
from app.schemas.question import (
    GenerateQuestionsRequest,
    QuestionCreate,
    QuestionResponse,
    QuestionUpdate,
)

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("", response_model=List[QuestionResponse])
def list_questions(survey_id: int = None, db: Session = Depends(get_db)):
    q = db.query(Question)
    if survey_id:
        q = q.filter(Question.survey_id == survey_id)
    return q.all()


@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(payload: QuestionCreate, db: Session = Depends(get_db)):
    question = Question(**payload.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.post("/generate", response_model=List[QuestionResponse])
def generate_questions(payload: GenerateQuestionsRequest, db: Session = Depends(get_db)):
    mock_questions = []
    for i in range(1, payload.count + 1):
        q = Question(
            text=f"[AI Generated] Question {i} about '{payload.topic}'?",
            type=payload.type,
            options=["Option A", "Option B", "Option C", "Option D"],
            correct_answer="Option A",
        )
        db.add(q)
        db.flush()
        mock_questions.append(q)
    db.commit()
    for q in mock_questions:
        db.refresh(q)
    return mock_questions


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int, payload: QuestionUpdate, db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(question, field, value)
    db.commit()
    db.refresh(question)
    return question


@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(question)
    db.commit()

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_role
from app.models.question import Question
from app.models.screening import ScreeningQuestion
from app.models.user import User
from app.schemas.question import (
    ApproveQuestionsRequest,
    GeneratedQuestionOut,
    GenerateScreeningQuestionsRequest,
    QuestionCreate,
    QuestionResponse,
    QuestionUpdate,
)
from app.schemas.screening import ScreeningQuestionOut

router = APIRouter(prefix="/questions", tags=["questions"])


def _sleep_bank():
    return [
        {"text": "How many hours of sleep did you get on average this week?", "type": "rating", "options": None},
        {"text": "How would you rate your sleep quality this week?", "type": "mcq", "options": ["Very poor", "Poor", "Fair", "Good", "Excellent"]},
        {"text": "I fell asleep within 30 minutes most nights this week", "type": "truefalse", "options": None},
        {"text": "How often did you wake up during the night?", "type": "mcq", "options": ["Never", "Rarely", "Sometimes", "Often", "Almost always"]},
        {"text": "What, if anything, disrupted your sleep this week?", "type": "fill", "options": None},
        {"text": "Rate how rested you felt on waking (1=exhausted, 10=fully rested)", "type": "rating", "options": None},
    ]


def _anxiety_bank():
    return [
        {"text": "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?", "type": "rating", "options": None},
        {"text": "How often have you had trouble relaxing?", "type": "rating", "options": None},
        {"text": "How often have you been unable to stop or control worrying?", "type": "rating", "options": None},
        {"text": "I have felt restless or found it hard to sit still", "type": "truefalse", "options": None},
        {"text": "How would you describe your anxiety level this week?", "type": "mcq", "options": ["Minimal", "Mild", "Moderate", "Severe"]},
        {"text": "What situations triggered anxiety for you this week?", "type": "fill", "options": None},
    ]


def _mood_bank():
    return [
        {"text": "How would you rate your overall mood this week?", "type": "mcq", "options": ["Very low", "Low", "Moderate", "Good", "Excellent"]},
        {"text": "Rate how often you felt hopeless about the future (1=never, 10=constantly)", "type": "rating", "options": None},
        {"text": "I found it hard to feel interested or pleasure in activities this week", "type": "truefalse", "options": None},
        {"text": "How connected did you feel to the people around you?", "type": "mcq", "options": ["Very isolated", "Somewhat isolated", "Neutral", "Connected", "Very connected"]},
        {"text": "What is one thing that affected your mood this week?", "type": "fill", "options": None},
        {"text": "Rate your overall emotional wellbeing this week (1=very poor, 10=excellent)", "type": "rating", "options": None},
    ]


def _resilience_bank():
    return [
        {"text": "How well were you able to bounce back after a stressful moment this week?", "type": "mcq", "options": ["Not at all", "Slightly", "Moderately", "Well", "Very well"]},
        {"text": "Rate your ability to manage stress this week (1=poor, 10=excellent)", "type": "rating", "options": None},
        {"text": "I was able to maintain my daily routine this week", "type": "truefalse", "options": None},
        {"text": "How often did you use a coping strategy when things got difficult?", "type": "mcq", "options": ["Never", "Rarely", "Sometimes", "Often", "Almost always"]},
        {"text": "Describe one challenge you faced this week and how you handled it", "type": "fill", "options": None},
        {"text": "Rate your overall sense of resilience this week (1=low, 10=high)", "type": "rating", "options": None},
    ]


def _bank_for_topic(topic: str) -> list:
    lowered = topic.lower()
    if "sleep" in lowered:
        return _sleep_bank()
    if "anxi" in lowered:
        return _anxiety_bank()
    if "mood" in lowered:
        return _mood_bank()
    return _resilience_bank()


@router.post("/generate", response_model=List[GeneratedQuestionOut])
def generate_screening_questions(payload: GenerateScreeningQuestionsRequest, user: User = Depends(require_role("admin"))):
    count = max(1, min(payload.count, 20))
    bank = _bank_for_topic(payload.topic)

    if payload.question_type:
        bank = [q for q in bank if q["type"] == payload.question_type] or bank

    questions = []
    i = 0
    while len(questions) < count:
        template = bank[i % len(bank)]
        cycle = i // len(bank)
        text = template["text"] if cycle == 0 else f"{template['text']} (follow-up {cycle + 1})"
        questions.append(
            GeneratedQuestionOut(
                text=text,
                type=template["type"],
                options=template["options"],
                suggested_answer=None,
            )
        )
        i += 1

    return questions


@router.post("/approve", response_model=List[ScreeningQuestionOut])
def approve_questions(
    payload: ApproveQuestionsRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    max_order = (
        db.query(ScreeningQuestion)
        .filter(ScreeningQuestion.screening_id == payload.screening_id)
        .count()
    )

    created = []
    for i, q in enumerate(payload.questions):
        record = ScreeningQuestion(
            screening_id=payload.screening_id,
            text=q.text,
            type=q.type,
            options=q.options,
            correct_answer=q.suggested_answer,
            order_index=max_order + i,
            is_required=True,
        )
        db.add(record)
        db.flush()
        created.append(record)

    db.commit()
    for record in created:
        db.refresh(record)

    return [ScreeningQuestionOut.model_validate(q) for q in created]


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

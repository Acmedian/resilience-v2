from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.scribe_session import ScribeSession
from app.schemas.scribe_session import (
    ScribeSessionCreate,
    ScribeSessionResponse,
    SummariseRequest,
)

router = APIRouter(prefix="/scribe", tags=["scribe"])


@router.get("/sessions", response_model=List[ScribeSessionResponse])
def list_sessions(doctor_id: int = None, db: Session = Depends(get_db)):
    q = db.query(ScribeSession)
    if doctor_id:
        q = q.filter(ScribeSession.doctor_id == doctor_id)
    return q.all()


@router.post(
    "/sessions",
    response_model=ScribeSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_session(payload: ScribeSessionCreate, db: Session = Depends(get_db)):
    session = ScribeSession(**payload.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions/{session_id}", response_model=ScribeSessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(ScribeSession).filter(ScribeSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.post("/sessions/{session_id}/summarise", response_model=ScribeSessionResponse)
def summarise_session(
    session_id: int,
    payload: SummariseRequest = None,
    db: Session = Depends(get_db),
):
    session = db.query(ScribeSession).filter(ScribeSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    transcript = (payload and payload.transcript) or session.transcript or ""

    # Mock AI summarisation
    session.summary = {
        "chief_complaint": "Patient reported symptoms as described in transcript.",
        "assessment": "Clinical assessment based on consultation.",
        "plan": "Follow-up in 2 weeks. Prescribe as indicated.",
        "medications": [],
        "generated_from": transcript[:100] + "..." if len(transcript) > 100 else transcript,
    }
    db.commit()
    db.refresh(session)
    return session

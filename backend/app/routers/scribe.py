from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_role
from app.models.patient import ClinicalPatient
from app.models.scribe_session import ScribeSession
from app.models.user import User
from app.schemas.scribe_session import (
    ScribeSessionCreate,
    ScribeSessionCreateResponse,
    ScribeSessionListItem,
    ScribeSessionOut,
    ScribeSessionUpdate,
    SummariseResponse,
    TranscriptAppendRequest,
)

router = APIRouter(prefix="/scribe", tags=["scribe"])

POSITIVE_KEYWORDS = [
    "better", "improved", "improving", "good", "great", "progress",
    "easier", "helps", "helping", "helpful", "manageable", "calmer",
]


def _get_session_or_404(session_id: int, db: Session) -> ScribeSession:
    session = db.query(ScribeSession).filter(ScribeSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Scribe session not found")
    return session


def _authorize(session: ScribeSession, user: User):
    if user.role == "clinician" and session.clinician_id != user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")


def _to_out(db: Session, session: ScribeSession) -> ScribeSessionOut:
    patient = db.query(ClinicalPatient).filter(ClinicalPatient.id == session.patient_id).first()
    return ScribeSessionOut(
        id=session.id,
        patient_id=session.patient_id,
        patient_name=patient.name if patient else "Unknown patient",
        clinician_id=session.clinician_id,
        transcript=session.transcript or [],
        summary=session.summary,
        status=session.status,
        duration_seconds=session.duration_seconds,
        share_with_patient=session.share_with_patient,
        recorded_at=session.recorded_at,
        completed_at=session.completed_at,
    )


def _build_summary(transcript: list) -> dict:
    patient_lines = [line for line in transcript if line.get("speaker") == "patient"]
    all_text = " ".join(line.get("text", "") for line in transcript)

    chief_complaint = (
        patient_lines[0]["text"] if patient_lines else "Session recorded - see transcript"
    )

    positive_mentions = [
        line["text"]
        for line in patient_lines
        if any(keyword in line.get("text", "").lower() for keyword in POSITIVE_KEYWORDS)
    ]
    if positive_mentions:
        progress = "Patient reported " + "; ".join(positive_mentions)
    else:
        progress = "No significant positive changes reported this session."

    session_notes = all_text[:200] + ("..." if len(all_text) > 200 else "")

    return {
        "chief_complaint": chief_complaint,
        "progress": progress,
        "medication_response": "To be completed by clinician",
        "mental_state": "Assessed during session - see transcript for details",
        "recommended_followup": "Follow-up recommended in 2-4 weeks",
        "session_notes": session_notes or "No transcript recorded.",
    }


@router.post("/sessions", response_model=ScribeSessionCreateResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    payload: ScribeSessionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    patient = db.query(ClinicalPatient).filter(ClinicalPatient.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if user.role == "clinician" and patient.clinician_id != user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session = ScribeSession(
        patient_id=patient.id,
        clinician_id=user.id,
        transcript=[],
        status="recording",
        recorded_at=datetime.utcnow(),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return ScribeSessionCreateResponse(
        session_id=session.id,
        patient_id=patient.id,
        patient_name=patient.name,
        recorded_at=session.recorded_at,
    )


@router.get("/sessions", response_model=list[ScribeSessionListItem])
def list_sessions(
    patient_id: int = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    q = db.query(ScribeSession)
    if user.role == "clinician":
        q = q.filter(ScribeSession.clinician_id == user.id)
    if patient_id is not None:
        q = q.filter(ScribeSession.patient_id == patient_id)

    sessions = q.order_by(ScribeSession.recorded_at.desc()).all()
    items = []
    for session in sessions:
        patient = db.query(ClinicalPatient).filter(ClinicalPatient.id == session.patient_id).first()
        items.append(
            ScribeSessionListItem(
                id=session.id,
                patient_id=session.patient_id,
                patient_name=patient.name if patient else "Unknown patient",
                status=session.status,
                duration_seconds=session.duration_seconds,
                recorded_at=session.recorded_at,
                completed_at=session.completed_at,
            )
        )
    return items


@router.get("/sessions/{session_id}", response_model=ScribeSessionOut)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    session = _get_session_or_404(session_id, db)
    _authorize(session, user)
    return _to_out(db, session)


@router.post("/sessions/{session_id}/transcript", response_model=ScribeSessionOut)
def append_transcript(
    session_id: int,
    payload: TranscriptAppendRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    session = _get_session_or_404(session_id, db)
    _authorize(session, user)

    existing = list(session.transcript or [])
    existing.extend(line.model_dump() for line in payload.lines)
    session.transcript = existing
    db.commit()
    db.refresh(session)
    return _to_out(db, session)


@router.post("/sessions/{session_id}/summarise", response_model=SummariseResponse)
def summarise_session(
    session_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    session = _get_session_or_404(session_id, db)
    _authorize(session, user)

    transcript = session.transcript or []
    summary = _build_summary(transcript)

    session.summary = summary
    session.status = "completed"
    session.completed_at = datetime.utcnow()
    if session.recorded_at:
        session.duration_seconds = int((session.completed_at - session.recorded_at).total_seconds())
    db.commit()

    return SummariseResponse(summary=summary, session_id=session.id)


@router.patch("/sessions/{session_id}", response_model=ScribeSessionOut)
def update_session(
    session_id: int,
    payload: ScribeSessionUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    session = _get_session_or_404(session_id, db)
    _authorize(session, user)

    if payload.summary is not None:
        merged = dict(session.summary or {})
        merged.update(payload.summary)
        session.summary = merged
    if payload.share_with_patient is not None:
        session.share_with_patient = payload.share_with_patient

    db.commit()
    db.refresh(session)
    return _to_out(db, session)


@router.get("/sessions/{session_id}/shared", response_model=ScribeSessionOut)
def get_shared_session(
    session_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("patient", "clinician", "admin")),
):
    session = _get_session_or_404(session_id, db)

    if user.role == "patient":
        patient = db.query(ClinicalPatient).filter(ClinicalPatient.id == session.patient_id).first()
        is_owner = patient and patient.email and patient.email == user.email
        if not (is_owner and session.share_with_patient):
            raise HTTPException(status_code=403, detail="This session has not been shared with you")
    else:
        _authorize(session, user)

    return _to_out(db, session)

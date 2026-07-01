from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_role
from app.core.security import get_password_hash
from app.models.patient import ClinicalPatient
from app.models.result import Result
from app.models.scribe_session import ScribeSession
from app.models.screening import PatientScreeningAssignment, ScreeningResult
from app.models.survey import Survey
from app.models.user import User
from app.routers.patients import _linked_user
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/admin", tags=["admin"])

COHORTS = ["CBT Program", "Mindfulness Group", "Self-Guided"]


def _cohort_breakdown(db: Session):
    breakdown = []
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)

    for cohort_name in COHORTS:
        patients = (
            db.query(ClinicalPatient)
            .filter(ClinicalPatient.cohort_name == cohort_name, ClinicalPatient.is_active.is_(True))
            .all()
        )
        scores_this_week = []
        scores_last_week = []

        for patient in patients:
            user = _linked_user(db, patient)
            if not user:
                continue
            results = (
                db.query(ScreeningResult)
                .filter(ScreeningResult.patient_id == user.id, ScreeningResult.status == "completed")
                .all()
            )
            for result in results:
                if result.score is None or result.completed_at is None:
                    continue
                if result.completed_at >= week_ago:
                    scores_this_week.append(result.score)
                elif two_weeks_ago <= result.completed_at < week_ago:
                    scores_last_week.append(result.score)

        avg_this_week = sum(scores_this_week) / len(scores_this_week) if scores_this_week else 0.0
        avg_last_week = sum(scores_last_week) / len(scores_last_week) if scores_last_week else 0.0
        change = round(avg_this_week - avg_last_week, 1) if scores_last_week else 0.0

        breakdown.append({
            "cohort_name": cohort_name,
            "patient_count": len(patients),
            "avg_score": round(avg_this_week, 1) if scores_this_week else 0.0,
            "week_over_week_change": change,
        })

    return breakdown


def _compute_stats(db: Session) -> dict:
    completed_results = db.query(ScreeningResult).filter(ScreeningResult.status == "completed").all()
    scored = [r.score for r in completed_results if r.score is not None]
    avg_resilience_score = round(sum(scored) / len(scored), 1) if scored else 0.0

    active_patients = db.query(User).filter(User.role == "patient", User.is_active.is_(True)).count()
    screenings_completed = len(completed_results)
    high_risk_flags = (
        db.query(ClinicalPatient)
        .filter(ClinicalPatient.risk_status == "high_risk", ClinicalPatient.is_active.is_(True))
        .count()
    )

    total_assigned = db.query(PatientScreeningAssignment).count()
    total_completed_assignments = (
        db.query(PatientScreeningAssignment).filter(PatientScreeningAssignment.status == "completed").count()
    )
    screening_participation = (
        round((total_completed_assignments / total_assigned) * 100, 1) if total_assigned else 0.0
    )

    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)
    scores_this_week = [
        r.score for r in completed_results
        if r.score is not None and r.completed_at and r.completed_at >= week_ago
    ]
    scores_last_week = [
        r.score for r in completed_results
        if r.score is not None and r.completed_at and two_weeks_ago <= r.completed_at < week_ago
    ]
    avg_this_week = sum(scores_this_week) / len(scores_this_week) if scores_this_week else None
    avg_last_week = sum(scores_last_week) / len(scores_last_week) if scores_last_week else None
    avg_resilience_score_change = (
        round(avg_this_week - avg_last_week, 1) if avg_this_week is not None and avg_last_week is not None else None
    )

    return {
        "avg_resilience_score": avg_resilience_score,
        "avg_resilience_score_change": avg_resilience_score_change,
        "active_patients": active_patients,
        "screenings_completed": screenings_completed,
        "high_risk_flags": high_risk_flags,
        "screening_participation": screening_participation,
        "assignments_completed": total_completed_assignments,
        "assignments_total": total_assigned,
        "cohort_breakdown": _cohort_breakdown(db),
    }


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    stats = _compute_stats(db)
    stats.update({
        "total_users": db.query(User).count(),
        "total_surveys": db.query(Survey).count(),
        "total_results": db.query(Result).count(),
        "total_patients": db.query(ClinicalPatient).count(),
        "total_scribe_sessions": db.query(ScribeSession).count(),
        "users_by_role": {
            role: db.query(User).filter(User.role == role).count()
            for role in ["patient", "clinician", "admin"]
        },
    })
    return stats


class AskQuestionRequest(BaseModel):
    question: str


@router.post("/stats")
def ask_stats_question(
    payload: AskQuestionRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    stats = _compute_stats(db)
    q = payload.question.lower()

    if "high risk" in q or "high-risk" in q:
        answer = f"There are currently {stats['high_risk_flags']} patients flagged as high risk."
    elif "cohort" in q:
        leader = max(stats["cohort_breakdown"], key=lambda c: c["avg_score"], default=None)
        if leader and leader["avg_score"]:
            answer = f"{leader['cohort_name']} leads with an average score of {leader['avg_score']}."
        else:
            answer = "No cohort screening data is available yet."
    elif "participation" in q:
        answer = f"Screening participation is currently {stats['screening_participation']}%."
    else:
        answer = (
            "I can help with questions about high risk patients, cohort performance, "
            "and screening participation. Try asking about one of those."
        )

    return {"answer": answer, "stats": stats}


@router.get("/users", response_model=list[UserResponse])
def list_users(
    role: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    if search:
        like = f"%{search}%"
        q = q.filter((User.name.ilike(like)) | (User.email.ilike(like)))
    return q.order_by(User.created_at.desc()).all()


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if payload.role in ("clinician", "admin") and not payload.password:
        raise HTTPException(status_code=400, detail="Password is required for clinician/admin accounts")

    new_user = User(
        email=payload.email,
        name=payload.name,
        role=payload.role,
        hashed_password=get_password_hash(payload.password) if payload.password else None,
        cohort_id=payload.cohort_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


class RoleChangeRequest(BaseModel):
    role: str


@router.put("/users/{user_id}/role", response_model=UserResponse)
def change_user_role(
    user_id: int,
    payload: RoleChangeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.role not in ("patient", "clinician", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")

    target.role = payload.role
    db.commit()
    db.refresh(target)
    return target


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    target.is_active = False
    db.commit()

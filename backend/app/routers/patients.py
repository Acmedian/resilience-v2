from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_role
from app.models.patient import ClinicalPatient
from app.models.scribe_session import ScribeSession
from app.models.screening import Screening, ScreeningResult
from app.models.user import User
from app.schemas.patient import (
    LatestScreeningOut,
    PatientCreate,
    PatientDetailResponse,
    PatientResponse,
    PatientUpdate,
    ScreeningHistoryItem,
    ScribeSessionBrief,
)

router = APIRouter(prefix="/patients", tags=["patients"])


def _linked_user(db: Session, patient: ClinicalPatient) -> Optional[User]:
    if not patient.email:
        return None
    return (
        db.query(User)
        .filter(User.email == patient.email, User.role == "patient")
        .first()
    )


def _latest_screening(db: Session, patient: ClinicalPatient) -> Optional[LatestScreeningOut]:
    user = _linked_user(db, patient)
    if not user:
        return None

    result = (
        db.query(ScreeningResult)
        .filter(ScreeningResult.patient_id == user.id, ScreeningResult.status == "completed")
        .order_by(ScreeningResult.completed_at.desc())
        .first()
    )
    if not result:
        return None

    screening = db.query(Screening).filter(Screening.id == result.screening_id).first()
    return LatestScreeningOut(
        screening_title=screening.title if screening else "Screening",
        score=result.score,
        voice_mode=result.voice_mode,
        completed_at=result.completed_at,
    )


def _screening_history(db: Session, patient: ClinicalPatient, limit: int = 10):
    user = _linked_user(db, patient)
    if not user:
        return []

    results = (
        db.query(ScreeningResult)
        .filter(ScreeningResult.patient_id == user.id, ScreeningResult.status == "completed")
        .order_by(ScreeningResult.completed_at.desc())
        .limit(limit)
        .all()
    )

    history = []
    for result in results:
        screening = db.query(Screening).filter(Screening.id == result.screening_id).first()
        history.append(
            ScreeningHistoryItem(
                result_id=result.id,
                screening_id=result.screening_id,
                screening_title=screening.title if screening else "Screening",
                score=result.score,
                voice_mode=result.voice_mode,
                completed_at=result.completed_at,
            )
        )
    return history


def _to_response(db: Session, patient: ClinicalPatient) -> PatientResponse:
    data = PatientResponse.model_validate(patient)
    data.latest_screening = _latest_screening(db, patient)
    return data


def _get_patient_or_404(patient_id: int, db: Session) -> ClinicalPatient:
    patient = db.query(ClinicalPatient).filter(ClinicalPatient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


def _authorize_access(patient: ClinicalPatient, user: User):
    if user.role == "clinician" and patient.clinician_id != user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")


@router.get("", response_model=list[PatientResponse])
def list_patients(
    cohort_id: Optional[int] = Query(None),
    risk_status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    q = db.query(ClinicalPatient).filter(ClinicalPatient.is_active.is_(True))

    if user.role == "clinician":
        q = q.filter(ClinicalPatient.clinician_id == user.id)
    if cohort_id is not None:
        q = q.filter(ClinicalPatient.cohort_id == cohort_id)
    if risk_status:
        q = q.filter(ClinicalPatient.risk_status == risk_status)
    if search:
        like = f"%{search}%"
        q = q.filter(
            (ClinicalPatient.name.ilike(like))
            | (ClinicalPatient.email.ilike(like))
            | (ClinicalPatient.cohort_name.ilike(like))
        )

    patients = q.order_by(ClinicalPatient.created_at.desc()).all()
    return [_to_response(db, p) for p in patients]


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    payload: PatientCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    patient = ClinicalPatient(
        name=payload.name,
        email=payload.email,
        age=payload.age,
        gender=payload.gender,
        condition=payload.condition,
        cohort_name=payload.cohort_name,
        notes=payload.notes,
        clinician_id=user.id,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return _to_response(db, patient)


@router.get("/{patient_id}", response_model=PatientDetailResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    patient = _get_patient_or_404(patient_id, db)
    _authorize_access(patient, user)

    scribe_sessions = (
        db.query(ScribeSession)
        .filter(ScribeSession.patient_id == patient_id)
        .order_by(ScribeSession.recorded_at.desc())
        .all()
    )

    return PatientDetailResponse(
        patient=_to_response(db, patient),
        screening_history=_screening_history(db, patient),
        scribe_sessions=[ScribeSessionBrief.model_validate(s) for s in scribe_sessions],
    )


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    payload: PatientUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    patient = _get_patient_or_404(patient_id, db)
    _authorize_access(patient, user)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(patient, field, value)
    db.commit()
    db.refresh(patient)
    return _to_response(db, patient)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("clinician", "admin")),
):
    patient = _get_patient_or_404(patient_id, db)
    _authorize_access(patient, user)

    patient.is_active = False
    db.commit()

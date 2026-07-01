from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.core.scoring import compute_screening_score
from app.models.screening import (
    PatientScreeningAssignment,
    Screening,
    ScreeningQuestion,
    ScreeningResult,
)
from app.models.user import User
from app.schemas.screening import (
    AssignDefaultsResponse,
    LastResultOut,
    MyScreeningItem,
    ResultDetailOut,
    ResultOut,
    ResultQuestionOut,
    ScreeningDetailOut,
    ScreeningOut,
    ScreeningQuestionOut,
    StartScreeningRequest,
    StartScreeningResponse,
    SubmitScreeningRequest,
    SubmitScreeningResponse,
)

router = APIRouter(prefix="/screenings", tags=["screenings"])


def _get_screening_or_404(screening_id: int, db: Session) -> Screening:
    screening = db.query(Screening).filter(Screening.id == screening_id).first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")
    return screening


def _ordered_questions(screening_id: int, db: Session):
    return (
        db.query(ScreeningQuestion)
        .filter(ScreeningQuestion.screening_id == screening_id)
        .order_by(ScreeningQuestion.order_index)
        .all()
    )


@router.get("/my", response_model=list[MyScreeningItem])
def my_screenings(
    db: Session = Depends(get_db),
    user: User = Depends(require_role("patient")),
):
    assignments = (
        db.query(PatientScreeningAssignment)
        .filter(PatientScreeningAssignment.patient_id == user.id)
        .all()
    )

    items = []
    now = datetime.utcnow()
    for assignment in assignments:
        screening = db.query(Screening).filter(Screening.id == assignment.screening_id).first()
        if not screening:
            continue

        effective_status = assignment.status
        if effective_status == "pending" and assignment.due_date and assignment.due_date < now:
            effective_status = "overdue"

        last_result = (
            db.query(ScreeningResult)
            .filter(
                ScreeningResult.screening_id == screening.id,
                ScreeningResult.patient_id == user.id,
            )
            .order_by(ScreeningResult.started_at.desc())
            .first()
        )

        items.append(
            MyScreeningItem(
                screening=ScreeningOut.model_validate(screening),
                assignment_status=effective_status,
                due_date=assignment.due_date,
                last_result=LastResultOut.model_validate(last_result) if last_result else None,
            )
        )

    return items


@router.post("/assign-defaults", response_model=AssignDefaultsResponse)
def assign_defaults(
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    active_screenings = db.query(Screening).filter(Screening.is_active.is_(True)).all()
    patients = db.query(User).filter(User.role == "patient").all()

    created = 0
    for patient in patients:
        existing_ids = {
            a.screening_id
            for a in db.query(PatientScreeningAssignment)
            .filter(PatientScreeningAssignment.patient_id == patient.id)
            .all()
        }
        for screening in active_screenings:
            if screening.id in existing_ids:
                continue
            db.add(
                PatientScreeningAssignment(
                    patient_id=patient.id,
                    screening_id=screening.id,
                    assigned_at=datetime.utcnow(),
                    due_date=None,
                    status="pending",
                )
            )
            created += 1

    db.commit()
    return AssignDefaultsResponse(created=created)


@router.post("/assign-to-me", response_model=list[ScreeningOut])
def assign_to_me(
    db: Session = Depends(get_db),
    user: User = Depends(require_role("patient")),
):
    active_screenings = db.query(Screening).filter(Screening.is_active.is_(True)).all()
    existing_ids = {
        a.screening_id
        for a in db.query(PatientScreeningAssignment)
        .filter(PatientScreeningAssignment.patient_id == user.id)
        .all()
    }

    newly_assigned = []
    for screening in active_screenings:
        if screening.id in existing_ids:
            continue
        db.add(
            PatientScreeningAssignment(
                patient_id=user.id,
                screening_id=screening.id,
                assigned_at=datetime.utcnow(),
                due_date=None,
                status="pending",
            )
        )
        newly_assigned.append(screening)

    db.commit()
    return [ScreeningOut.model_validate(s) for s in newly_assigned]


@router.get("/{screening_id}", response_model=ScreeningDetailOut)
def get_screening(
    screening_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    screening = _get_screening_or_404(screening_id, db)
    questions = _ordered_questions(screening_id, db)
    return ScreeningDetailOut(
        screening=ScreeningOut.model_validate(screening),
        questions=[ScreeningQuestionOut.model_validate(q) for q in questions],
    )


@router.post("/{screening_id}/start", response_model=StartScreeningResponse)
def start_screening(
    screening_id: int,
    payload: StartScreeningRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("patient")),
):
    screening = _get_screening_or_404(screening_id, db)

    result = (
        db.query(ScreeningResult)
        .filter(
            ScreeningResult.screening_id == screening_id,
            ScreeningResult.patient_id == user.id,
            ScreeningResult.status == "in_progress",
        )
        .order_by(ScreeningResult.started_at.desc())
        .first()
    )

    if not result:
        result = ScreeningResult(
            screening_id=screening_id,
            patient_id=user.id,
            answers={},
            status="in_progress",
            started_at=datetime.utcnow(),
            voice_mode=payload.voice_mode,
        )
        db.add(result)
        db.commit()
        db.refresh(result)

    assignment = (
        db.query(PatientScreeningAssignment)
        .filter(
            PatientScreeningAssignment.screening_id == screening_id,
            PatientScreeningAssignment.patient_id == user.id,
        )
        .first()
    )
    if assignment and assignment.status == "pending":
        assignment.status = "in_progress"
        db.commit()

    questions = _ordered_questions(screening_id, db)
    return StartScreeningResponse(
        result_id=result.id,
        questions=[ScreeningQuestionOut.model_validate(q) for q in questions],
        screening=ScreeningOut.model_validate(screening),
    )


@router.post("/{screening_id}/submit", response_model=SubmitScreeningResponse)
def submit_screening(
    screening_id: int,
    payload: SubmitScreeningRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("patient")),
):
    screening = _get_screening_or_404(screening_id, db)

    result = (
        db.query(ScreeningResult)
        .filter(
            ScreeningResult.id == payload.result_id,
            ScreeningResult.screening_id == screening_id,
            ScreeningResult.patient_id == user.id,
        )
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="Screening result not found")

    questions = _ordered_questions(screening_id, db)
    score = compute_screening_score(questions, payload.answers)

    result.answers = payload.answers
    result.voice_mode = payload.voice_mode
    result.status = "completed"
    result.completed_at = datetime.utcnow()
    result.score = score
    db.commit()

    assignment = (
        db.query(PatientScreeningAssignment)
        .filter(
            PatientScreeningAssignment.screening_id == screening_id,
            PatientScreeningAssignment.patient_id == user.id,
        )
        .first()
    )
    if assignment:
        assignment.status = "completed"
        db.commit()

    return SubmitScreeningResponse(
        score=score,
        screening_title=screening.title,
        completed_at=result.completed_at,
    )


@router.get("/{screening_id}/result/{result_id}", response_model=ResultDetailOut)
def get_result(
    screening_id: int,
    result_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    screening = _get_screening_or_404(screening_id, db)

    result = (
        db.query(ScreeningResult)
        .filter(
            ScreeningResult.id == result_id,
            ScreeningResult.screening_id == screening_id,
        )
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="Screening result not found")

    if user.role == "patient" and result.patient_id != user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    questions = _ordered_questions(screening_id, db)
    answers = result.answers or {}
    question_items = [
        ResultQuestionOut(
            id=q.id,
            text=q.text,
            type=q.type,
            options=q.options,
            order_index=q.order_index,
            patient_answer=answers.get(str(q.id)),
        )
        for q in questions
    ]

    return ResultDetailOut(
        result=ResultOut.model_validate(result),
        screening=ScreeningOut.model_validate(screening),
        questions=question_items,
    )

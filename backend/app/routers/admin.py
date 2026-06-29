from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.patient import ClinicalPatient
from app.models.result import Result
from app.models.scribe_session import ScribeSession
from app.models.survey import Survey
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count(),
        "total_surveys": db.query(Survey).count(),
        "total_results": db.query(Result).count(),
        "total_patients": db.query(ClinicalPatient).count(),
        "total_scribe_sessions": db.query(ScribeSession).count(),
        "users_by_role": {
            role: db.query(User).filter(User.role == role).count()
            for role in ["superadmin", "admin", "doctor", "nurse", "staff"]
        },
    }

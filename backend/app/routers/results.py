from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.result import Result
from app.schemas.result import ResultCreate, ResultResponse

router = APIRouter(prefix="/results", tags=["results"])


@router.get("", response_model=List[ResultResponse])
def list_results(survey_id: int = None, db: Session = Depends(get_db)):
    q = db.query(Result)
    if survey_id:
        q = q.filter(Result.survey_id == survey_id)
    return q.all()


@router.post("", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(payload: ResultCreate, db: Session = Depends(get_db)):
    result = Result(**payload.model_dump())
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


@router.get("/{user_id}", response_model=List[ResultResponse])
def get_results_for_user(user_id: int, db: Session = Depends(get_db)):
    results = db.query(Result).filter(Result.user_id == user_id).all()
    return results

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.survey import Survey
from app.schemas.survey import SurveyCreate, SurveyResponse, SurveyUpdate

router = APIRouter(prefix="/surveys", tags=["surveys"])


@router.get("", response_model=List[SurveyResponse])
def list_surveys(db: Session = Depends(get_db)):
    return db.query(Survey).all()


@router.post("", response_model=SurveyResponse, status_code=status.HTTP_201_CREATED)
def create_survey(payload: SurveyCreate, db: Session = Depends(get_db)):
    survey = Survey(**payload.model_dump())
    db.add(survey)
    db.commit()
    db.refresh(survey)
    return survey


@router.get("/{survey_id}", response_model=SurveyResponse)
def get_survey(survey_id: int, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey


@router.put("/{survey_id}", response_model=SurveyResponse)
def update_survey(survey_id: int, payload: SurveyUpdate, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(survey, field, value)
    db.commit()
    db.refresh(survey)
    return survey


@router.delete("/{survey_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_survey(survey_id: int, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    db.delete(survey)
    db.commit()

from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON
from app.core.database import Base


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    answers = Column(JSON, nullable=True)
    score = Column(Float, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)

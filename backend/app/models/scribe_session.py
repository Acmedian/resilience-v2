from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, Text
from app.core.database import Base


class ScribeSession(Base):
    __tablename__ = "scribe_sessions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("clinical_patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transcript = Column(Text, nullable=True)
    summary = Column(JSON, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

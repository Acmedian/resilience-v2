from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, JSON
from app.core.database import Base


class ScribeSession(Base):
    __tablename__ = "scribe_sessions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("clinical_patients.id"), nullable=False)
    clinician_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transcript = Column(JSON, nullable=False, default=list)
    summary = Column(JSON, nullable=True)
    status = Column(
        Enum("recording", "processing", "completed", name="scribe_session_status"),
        nullable=False,
        default="recording",
    )
    duration_seconds = Column(Integer, nullable=True)
    share_with_patient = Column(Boolean, nullable=False, default=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String, Text
from app.core.database import Base


class ClinicalPatient(Base):
    __tablename__ = "clinical_patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(Enum("male", "female", "non_binary", "undisclosed", name="patient_gender"), nullable=True)
    condition = Column(Text, nullable=True)
    clinician_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    cohort_id = Column(Integer, nullable=True)
    cohort_name = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    risk_status = Column(
        Enum("stable", "monitor", "high_risk", name="patient_risk_status"),
        nullable=False,
        default="stable",
    )
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from app.core.database import Base


class ClinicalPatient(Base):
    __tablename__ = "clinical_patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(Enum("male", "female", "other"), nullable=True)
    condition = Column(String(500), nullable=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    google_id = Column(String(255), unique=True, nullable=True)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)
    role = Column(
        Enum("patient", "clinician", "admin", name="user_role"),
        nullable=False,
        default="patient",
    )
    cohort_id = Column(Integer, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    picture_url = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

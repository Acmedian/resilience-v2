from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    google_id = Column(String(255), unique=True, nullable=True)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)
    role = Column(
        Enum("superadmin", "admin", "doctor", "nurse", "staff"),
        nullable=False,
        default="staff",
    )
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

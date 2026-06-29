from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from app.core.database import Base


class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    valid_from = Column(DateTime, nullable=True)
    valid_to = Column(DateTime, nullable=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

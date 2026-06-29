from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)

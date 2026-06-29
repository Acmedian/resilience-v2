from sqlalchemy import Column, Enum, ForeignKey, Integer, JSON, String
from app.core.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(1000), nullable=False)
    type = Column(
        Enum("multiple_choice", "true_false", "scale", "open_ended"),
        nullable=False,
        default="multiple_choice",
    )
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    options = Column(JSON, nullable=True)
    correct_answer = Column(String(500), nullable=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=True)

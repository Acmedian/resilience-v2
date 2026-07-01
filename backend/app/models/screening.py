from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)

from app.core.database import Base


class Screening(Base):
    __tablename__ = "screenings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(Enum("weekly", "monthly", "baseline", name="screening_type"), nullable=False)
    estimated_minutes = Column(Integer, nullable=False, default=5)
    cohort_id = Column(Integer, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ScreeningQuestion(Base):
    __tablename__ = "screening_questions"

    id = Column(Integer, primary_key=True, index=True)
    screening_id = Column(Integer, ForeignKey("screenings.id"), nullable=False)
    text = Column(String(1000), nullable=False)
    type = Column(
        Enum("mcq", "rating", "fill", "truefalse", "file", name="screening_question_type"),
        nullable=False,
    )
    options = Column(JSON, nullable=True)
    correct_answer = Column(String(500), nullable=True)
    order_index = Column(Integer, nullable=False, default=0)
    is_required = Column(Boolean, nullable=False, default=True)


class ScreeningResult(Base):
    __tablename__ = "screening_results"

    id = Column(Integer, primary_key=True, index=True)
    screening_id = Column(Integer, ForeignKey("screenings.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    answers = Column(JSON, nullable=False, default=dict)
    score = Column(Float, nullable=True)
    status = Column(
        Enum("in_progress", "completed", name="screening_result_status"),
        nullable=False,
        default="in_progress",
    )
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    voice_mode = Column(Boolean, nullable=False, default=False)


class PatientScreeningAssignment(Base):
    __tablename__ = "patient_screening_assignments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    screening_id = Column(Integer, ForeignKey("screenings.id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    status = Column(
        Enum("pending", "in_progress", "completed", "overdue", name="assignment_status"),
        nullable=False,
        default="pending",
    )

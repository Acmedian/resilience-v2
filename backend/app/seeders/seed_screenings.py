from datetime import datetime, timedelta

from app.core.database import Base, SessionLocal, engine
from app.core.scoring import compute_screening_score
from app.models.screening import (
    PatientScreeningAssignment,
    Screening,
    ScreeningQuestion,
    ScreeningResult,
)
from app.models.user import User

WEEKLY_RESILIENCE_QUESTIONS = [
    dict(
        text="How would you rate your overall mood this week?",
        type="mcq",
        options=["Very low", "Low", "Moderate", "Good", "Excellent"],
        correct_answer=None,
    ),
    dict(
        text="On a scale of 1-10, how well did you sleep this week?",
        type="rating",
        options=None,
        correct_answer=None,
    ),
    dict(
        text="How often did you feel overwhelmed in the past 7 days?",
        type="mcq",
        options=["Never", "Rarely", "Sometimes", "Often", "Almost always"],
        correct_answer=None,
    ),
    dict(
        text="Describe one challenge you faced this week and how you handled it",
        type="fill",
        options=None,
        correct_answer=None,
    ),
    dict(
        text="I was able to maintain my daily routine this week",
        type="truefalse",
        options=None,
        correct_answer=None,
    ),
    dict(
        text="Rate your energy levels this week (1=exhausted, 10=energized)",
        type="rating",
        options=None,
        correct_answer=None,
    ),
    dict(
        text="How connected did you feel to others this week?",
        type="mcq",
        options=["Very isolated", "Somewhat isolated", "Neutral", "Connected", "Very connected"],
        correct_answer=None,
    ),
    dict(
        text="What is one thing you are grateful for this week?",
        type="fill",
        options=None,
        correct_answer=None,
    ),
]

SLEEP_MOOD_QUESTIONS = [
    dict(
        text="Rate your average hours of sleep this week (1=very little, 10=full restful sleep)",
        type="rating",
        options=None,
        correct_answer=None,
    ),
    dict(
        text="How would you describe your sleep quality this week?",
        type="mcq",
        options=["Very poor", "Poor", "Fair", "Good", "Excellent"],
        correct_answer=None,
    ),
    dict(
        text="I woke up feeling rested most mornings this week",
        type="truefalse",
        options=None,
        correct_answer=None,
    ),
    dict(
        text="Rate how much your mood was affected by your sleep this week (1=not at all, 10=significantly)",
        type="rating",
        options=None,
        correct_answer=None,
    ),
    dict(
        text="What, if anything, disrupted your sleep this week?",
        type="fill",
        options=None,
        correct_answer=None,
    ),
]

GAD7_STEMS = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
]

GAD7_QUESTIONS = [
    dict(
        text=f"Over the past 2 weeks, how often have you been bothered by: {stem}? "
        "(1 = not at all, 10 = nearly every day)",
        type="rating",
        options=None,
        correct_answer=None,
    )
    for stem in GAD7_STEMS
]

SCREENINGS = [
    dict(
        title="Weekly Resilience Check",
        description="A short weekly check-in covering mood, sleep, stress and connection.",
        type="weekly",
        estimated_minutes=4,
        questions=WEEKLY_RESILIENCE_QUESTIONS,
    ),
    dict(
        title="Sleep & Mood Journal",
        description="A brief weekly journal tracking sleep quality and its effect on mood.",
        type="weekly",
        estimated_minutes=3,
        questions=SLEEP_MOOD_QUESTIONS,
    ),
    dict(
        title="Anxiety Baseline (GAD-7)",
        description="The standard 7-item GAD-7 generalized anxiety baseline screening.",
        type="baseline",
        estimated_minutes=5,
        questions=GAD7_QUESTIONS,
    ),
]


def _create_screening(db, data, created_by_id):
    screening = Screening(
        title=data["title"],
        description=data["description"],
        type=data["type"],
        estimated_minutes=data["estimated_minutes"],
        created_by=created_by_id,
        is_active=True,
    )
    db.add(screening)
    db.commit()
    db.refresh(screening)

    for index, q in enumerate(data["questions"]):
        db.add(
            ScreeningQuestion(
                screening_id=screening.id,
                text=q["text"],
                type=q["type"],
                options=q["options"],
                correct_answer=q["correct_answer"],
                order_index=index,
                is_required=True,
            )
        )
    db.commit()
    return screening


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_titles = {s.title for s in db.query(Screening).all()}
        screenings_by_title = {s.title: s for s in db.query(Screening).all()}

        patient = db.query(User).filter(User.email == "patient@demo.com").first()
        if not patient:
            print("patient@demo.com not found — run seed_users first")
            return
        admin = db.query(User).filter(User.role == "admin").first()
        created_by_id = admin.id if admin else None

        for data in SCREENINGS:
            if data["title"] in existing_titles:
                print(f"Skipping existing screening: {data['title']}")
                continue
            screening = _create_screening(db, data, created_by_id)
            screenings_by_title[data["title"]] = screening
            print(f"Created screening: {data['title']} ({len(data['questions'])} questions)")

        def _assignment_exists(screening_id):
            return (
                db.query(PatientScreeningAssignment)
                .filter(
                    PatientScreeningAssignment.patient_id == patient.id,
                    PatientScreeningAssignment.screening_id == screening_id,
                )
                .first()
            )

        weekly = screenings_by_title["Weekly Resilience Check"]
        sleep = screenings_by_title["Sleep & Mood Journal"]
        gad7 = screenings_by_title["Anxiety Baseline (GAD-7)"]

        now = datetime.utcnow()

        if not _assignment_exists(weekly.id):
            db.add(
                PatientScreeningAssignment(
                    patient_id=patient.id,
                    screening_id=weekly.id,
                    assigned_at=now,
                    due_date=now + timedelta(days=5),
                    status="pending",
                )
            )
            print("Assigned Weekly Resilience Check (pending, due in 5 days)")

        if not _assignment_exists(sleep.id):
            db.add(
                PatientScreeningAssignment(
                    patient_id=patient.id,
                    screening_id=sleep.id,
                    assigned_at=now,
                    due_date=now + timedelta(days=2),
                    status="pending",
                )
            )
            print("Assigned Sleep & Mood Journal (pending, due in 2 days)")

        if not _assignment_exists(gad7.id):
            gad7_questions = (
                db.query(ScreeningQuestion)
                .filter(ScreeningQuestion.screening_id == gad7.id)
                .order_by(ScreeningQuestion.order_index)
                .all()
            )
            # Mild anxiety profile: mostly "several days" (~4/10) with one higher spike
            sample_values = [4, 3, 5, 4, 2, 3, 4]
            answers = {
                str(q.id): value for q, value in zip(gad7_questions, sample_values)
            }
            score = compute_screening_score(gad7_questions, answers)

            started = now - timedelta(days=10)
            completed = started + timedelta(minutes=5)
            result = ScreeningResult(
                screening_id=gad7.id,
                patient_id=patient.id,
                answers=answers,
                score=score,
                status="completed",
                started_at=started,
                completed_at=completed,
                voice_mode=False,
            )
            db.add(result)

            db.add(
                PatientScreeningAssignment(
                    patient_id=patient.id,
                    screening_id=gad7.id,
                    assigned_at=started - timedelta(days=1),
                    due_date=None,
                    status="completed",
                )
            )
            print(f"Assigned Anxiety Baseline (GAD-7) — completed, score {score}")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()

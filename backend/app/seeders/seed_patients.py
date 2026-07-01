from datetime import datetime, timedelta

from app.core.database import Base, SessionLocal, engine
from app.models.patient import ClinicalPatient
from app.models.scribe_session import ScribeSession
from app.models.user import User
from app.routers.scribe import _build_summary

PATIENTS = [
    dict(
        name="Sarah Mitchell", email="sarah.mitchell@example.com", age=34, gender="female",
        cohort_name="CBT Program", condition="Anxiety Disorder", risk_status="stable",
    ),
    dict(
        name="James Carter", email="james.carter@example.com", age=42, gender="male",
        cohort_name="Mindfulness Group", condition="Depression", risk_status="monitor",
    ),
    dict(
        name="Rachel Adams", email="rachel.adams@example.com", age=28, gender="female",
        cohort_name="CBT Program", condition="PTSD", risk_status="high_risk",
    ),
    dict(
        name="David Lin", email="david.lin@example.com", age=51, gender="male",
        cohort_name="Self-Guided", condition="Stress/Burnout", risk_status="stable",
    ),
    dict(
        name="Emma Ortiz", email="emma.ortiz@example.com", age=39, gender="female",
        cohort_name="Mindfulness Group", condition="Anxiety Disorder", risk_status="monitor",
    ),
    dict(
        name="Tom Nguyen", email="tom.nguyen@example.com", age=45, gender="male",
        cohort_name="CBT Program", condition="Depression", risk_status="stable",
    ),
]

RACHEL_SESSION_1_TRANSCRIPT = [
    {"speaker": "clinician", "text": "How have you been feeling since our last session two weeks ago?", "timestamp": ""},
    {"speaker": "patient", "text": "Honestly, it's been a rough couple of weeks. The nightmares are back and I've been avoiding going out.", "timestamp": ""},
    {"speaker": "clinician", "text": "I'm sorry to hear that. Let's talk through what's been triggering the nightmares.", "timestamp": ""},
]

RACHEL_SESSION_2_TRANSCRIPT = [
    {"speaker": "clinician", "text": "Last time you mentioned the nightmares had returned. How has this week been?", "timestamp": ""},
    {"speaker": "patient", "text": "A little better actually. The grounding exercises are helping me fall back asleep faster.", "timestamp": ""},
    {"speaker": "clinician", "text": "That's good progress. Have you been able to leave the house more?", "timestamp": ""},
    {"speaker": "patient", "text": "Yes, I managed a short walk twice this week, though I still feel anxious in crowds.", "timestamp": ""},
]


def _stamp_timestamps(transcript, start: datetime):
    stamped = []
    for i, line in enumerate(transcript):
        stamped.append({**line, "timestamp": (start + timedelta(seconds=i * 25)).isoformat()})
    return stamped


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        clinician = db.query(User).filter(User.email == "clinician@demo.com").first()
        if not clinician:
            print("clinician@demo.com not found — run seed_users first")
            return

        existing_names = {
            p.name
            for p in db.query(ClinicalPatient).filter(ClinicalPatient.clinician_id == clinician.id).all()
        }

        patients_by_name = {}
        for data in PATIENTS:
            if data["name"] in existing_names:
                print(f"Skipping existing patient: {data['name']}")
                patients_by_name[data["name"]] = (
                    db.query(ClinicalPatient)
                    .filter(ClinicalPatient.name == data["name"], ClinicalPatient.clinician_id == clinician.id)
                    .first()
                )
                continue

            patient = ClinicalPatient(
                name=data["name"],
                email=data["email"],
                age=data["age"],
                gender=data["gender"],
                condition=data["condition"],
                cohort_name=data["cohort_name"],
                risk_status=data["risk_status"],
                clinician_id=clinician.id,
                is_active=True,
            )
            db.add(patient)
            db.commit()
            db.refresh(patient)
            patients_by_name[data["name"]] = patient
            print(f"Created patient: {data['name']} ({data['risk_status']})")

        rachel = patients_by_name["Rachel Adams"]
        existing_sessions = (
            db.query(ScribeSession).filter(ScribeSession.patient_id == rachel.id).count()
        )

        if existing_sessions == 0:
            now = datetime.utcnow()

            start1 = now - timedelta(days=14)
            transcript1 = _stamp_timestamps(RACHEL_SESSION_1_TRANSCRIPT, start1)
            session1 = ScribeSession(
                patient_id=rachel.id,
                clinician_id=clinician.id,
                transcript=transcript1,
                summary=_build_summary(transcript1),
                status="completed",
                duration_seconds=620,
                recorded_at=start1,
                completed_at=start1 + timedelta(seconds=620),
            )
            db.add(session1)

            start2 = now - timedelta(days=3)
            transcript2 = _stamp_timestamps(RACHEL_SESSION_2_TRANSCRIPT, start2)
            session2 = ScribeSession(
                patient_id=rachel.id,
                clinician_id=clinician.id,
                transcript=transcript2,
                summary=_build_summary(transcript2),
                status="completed",
                duration_seconds=740,
                recorded_at=start2,
                completed_at=start2 + timedelta(seconds=740),
            )
            db.add(session2)

            db.commit()
            print("Created 2 scribe sessions for Rachel Adams")
        else:
            print("Skipping scribe sessions for Rachel Adams (already exist)")

    finally:
        db.close()


if __name__ == "__main__":
    seed()

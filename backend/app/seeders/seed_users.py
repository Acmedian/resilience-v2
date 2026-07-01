from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User

DEMO_USERS = [
    {
        "email": "patient@demo.com",
        "name": "Priya Sharma",
        "role": "patient",
        "google_id": "demo_google_id_patient",
        "hashed_password": None,
    },
    {
        "email": "clinician@demo.com",
        "name": "Dr. Anita Sharma",
        "role": "clinician",
        "google_id": None,
        "hashed_password": get_password_hash("Clinician@2026"),
    },
    {
        "email": "admin@demo.com",
        "name": "Admin User",
        "role": "admin",
        "google_id": None,
        "hashed_password": get_password_hash("Admin@2026"),
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for data in DEMO_USERS:
            user = db.query(User).filter(User.email == data["email"]).first()
            if user:
                print(f"Skipping existing user: {data['email']}")
                continue
            user = User(**data)
            db.add(user)
            print(f"Created user: {data['email']} ({data['role']})")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()

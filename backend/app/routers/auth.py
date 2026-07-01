from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import (
    create_access_token,
    verify_google_token,
    verify_password,
)
from app.models.user import User
from app.schemas.user import (
    GoogleAuthRequest,
    LoginRequest,
    Token,
    UserResponse,
    UserSummary,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_token(user: User) -> Token:
    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
            "email": user.email,
            "name": user.name,
        }
    )
    return Token(access_token=token, user=UserSummary.model_validate(user))


@router.post("/google", response_model=Token)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    google_data = verify_google_token(payload.id_token)

    email = google_data.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account has no email",
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            google_id=google_data.get("google_id"),
            name=google_data.get("name") or email,
            role="patient",
            picture_url=google_data.get("picture"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.google_id:
        user.google_id = google_data.get("google_id")
        if google_data.get("picture"):
            user.picture_url = google_data.get("picture")
        db.commit()
        db.refresh(user)

    user.last_login = datetime.utcnow()
    db.commit()

    return _issue_token(user)


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    if user.role not in ("clinician", "admin"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    user.last_login = datetime.utcnow()
    db.commit()

    return _issue_token(user)


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return user

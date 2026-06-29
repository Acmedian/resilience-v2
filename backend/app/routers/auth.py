from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
    verify_google_token,
)
from app.models.user import User
from app.schemas.user import GoogleAuthRequest, LoginRequest, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/google", response_model=Token)
async def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    google_data = await verify_google_token(payload.token)
    if not google_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    email = google_data.get("email")
    google_id = google_data.get("sub")
    name = google_data.get("name", email)

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, google_id=google_id, name=name, role="staff")
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )

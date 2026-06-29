from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: Optional[str] = None
    role: str = "staff"
    unit_id: Optional[int] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    unit_id: Optional[int] = None


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    unit_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class GoogleAuthRequest(BaseModel):
    token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

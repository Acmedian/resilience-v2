from datetime import datetime, timedelta
from typing import Optional

import httpx
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None


async def verify_google_token(token: str) -> Optional[dict]:
    async with httpx.AsyncClient() as client:
        response = await client.get(GOOGLE_TOKEN_INFO_URL, params={"id_token": token})
        if response.status_code != 200:
            return None
        data = response.json()
        if data.get("aud") != settings.GOOGLE_CLIENT_ID:
            return None
        return data

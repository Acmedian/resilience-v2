from typing import Optional
from pydantic import BaseModel


class UnitCreate(BaseModel):
    name: str
    admin_id: Optional[int] = None


class UnitResponse(BaseModel):
    id: int
    name: str
    admin_id: Optional[int] = None

    class Config:
        from_attributes = True

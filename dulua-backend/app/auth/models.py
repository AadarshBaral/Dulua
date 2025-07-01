from enum import Enum
from sqlmodel import SQLModel, Field, Relationship  # type: ignore
from typing import Optional
from pydantic import EmailStr, BaseModel
from typing import Optional
from datetime import datetime, timedelta, timezone
import uuid
from uuid import UUID
from typing import Optional, TYPE_CHECKING


if TYPE_CHECKING:
    from app.models.core_models import LocalGuide


class UserBase(SQLModel):
    name: str = Field(index=True, nullable=False)
    email: EmailStr = Field(index=True, nullable=False)


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: int


class UserUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None


class PendingRegistration(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: EmailStr
    hashed_password: str
    otp_code: str
    expires_at: datetime


class VerifyOtp(BaseModel):
    email: EmailStr
    otp: str


class UserRoleEnum(str, Enum):
    user = "user"
    admin = "admin"
    guide = "guide"


class UserDB(UserBase, table=True):
    id: UUID = Field(default_factory=uuid.uuid4,
                     primary_key=True, nullable=False)
    hashed_password: str = Field(nullable=True)
    is_active: bool = Field(default=True, nullable=False)
    role: UserRoleEnum = Field(default=UserRoleEnum.user, nullable=False)

    local_guides: list["LocalGuide"] = Relationship(back_populates="user")


class UserLogin(BaseModel):
    email: EmailStr
    password: str

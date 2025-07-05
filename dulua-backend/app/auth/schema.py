from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field  # type: ignore
from pydantic import BaseModel, EmailStr


class UserRoleEnum(str, Enum):
    user = "user"
    admin = "admin"
    guide = "guide"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class VerifyOtp(BaseModel):
    email: EmailStr
    otp: str


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


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str

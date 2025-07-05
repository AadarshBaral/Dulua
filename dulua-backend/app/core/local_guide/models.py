
from typing import TYPE_CHECKING
from pydantic import BaseModel, EmailStr
from sqlmodel import Field, Relationship, SQLModel  # type: ignore
import uuid
from uuid import UUID
from app.auth.models import UserDB

if TYPE_CHECKING:
    from app.auth.models import UserDB


class LocalGuide(SQLModel, table=True):
    guide_id: UUID = Field(default_factory=uuid.uuid4,
                           primary_key=True, nullable=False)
    user_id: UUID = Field(foreign_key="userdb.id", nullable=False)
    id_image1: str = Field(index=True, nullable=False)
    id_image2: str = Field(index=True, nullable=False)
    name: str = Field(index=True, nullable=False)
    age: int = Field(nullable=False)
    address: str = Field(index=True, nullable=False)
    contact: int = Field(index=True, nullable=False)
    email: EmailStr = Field(index=True, nullable=False)
    user: "UserDB" = Relationship(back_populates="local_guides")
    bio: str = Field(index=True, nullable=False)
    language: str = Field(index=True, nullable=False)

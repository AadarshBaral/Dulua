from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from pydantic import EmailStr

if TYPE_CHECKING:
    from app.core.place.models import Bookmark  # for annotation only

class UserProfile(SQLModel, table=True):
    __tablename__ = "userprofile"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    userdb_id: UUID = Field(foreign_key="userdb.id", unique=True)
    handle: str = Field(index=True, unique=True)
    name:str
    email: EmailStr             
    country: Optional[str]
    image: Optional[str] = None
    contribution: int = 0
    green_points: int = 0

    bookmarks: List["Bookmark"] = Relationship(back_populates="user_profile")

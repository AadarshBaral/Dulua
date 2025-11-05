from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from app.auth.models import UserDB
if TYPE_CHECKING:
    from app.core.place.models import Bookmark


class UserProfile(SQLModel, table=True):
    __tablename__ = "userprofile"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    userdb: Optional[UserDB] = Relationship(back_populates="profile")
    userdb_id: UUID = Field(foreign_key="userdb.id",
                            unique=True, ondelete="CASCADE")
    handle: str = Field(index=True, unique=True)
    image: Optional[str] = None
    contribution: int = 0
    green_points: int = 0

    bookmarks: List["Bookmark"] = Relationship(
        back_populates="user_profile", cascade_delete=True)

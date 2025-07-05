
from typing import TYPE_CHECKING, Optional
from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel  # type: ignore
import uuid
from uuid import UUID


if TYPE_CHECKING:
    from app.models.core_models import Place


class City(SQLModel, table=True):
    city_id: UUID = Field(default_factory=uuid.uuid4,
                          primary_key=True, nullable=False)

    geo_location_id: UUID = Field(
        foreign_key="geolocation.geo_location_id", nullable=False, unique=True)

    geo_location: Optional["Geolocation"] = Relationship(
        sa_relationship_kwargs={"uselist": False})
    places: list["Place"] = Relationship(back_populates="city")


class Geolocation(SQLModel, table=True):
    geo_location_id: UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, nullable=False)
    name: str = Field(index=True, nullable=False)
    latitude: float = Field(index=True, nullable=False)
    longitude: float = Field(index=True, nullable=False)
    description: str = Field(index=True, nullable=False)

from turtle import back
from typing import Optional

from pydantic import BaseModel, EmailStr
from sqlmodel import Field, Relationship, Session, SQLModel, create_engine
import uuid
from uuid import UUID


class GeolocationCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    description: str


class PublicCity(GeolocationCreate):
    city_id: UUID


class PublicPlace(GeolocationCreate):
    city_id: UUID
    city_name: str


class City(SQLModel, table=True):
    city_id: UUID = Field(default_factory=uuid.uuid4,
                          primary_key=True, nullable=False)

    geo_location_id: UUID = Field(
        foreign_key="geolocation.geo_location_id", nullable=False, unique=True)

    geo_location: Optional["Geolocation"] = Relationship(
        sa_relationship_kwargs={"uselist": False})
    places: list["Place"] = Relationship(back_populates="city")


class Place(SQLModel, table=True):
    place_id: UUID = Field(default_factory=uuid.uuid4,
                           primary_key=True, nullable=False)
    city_id: UUID = Field(foreign_key="city.city_id", nullable=False)
    geo_location_id: UUID = Field(
        foreign_key="geolocation.geo_location_id", nullable=False, unique=True)

    city: Optional["City"] = Relationship(back_populates="places")
    geo_location: Optional["Geolocation"] = Relationship(
        sa_relationship_kwargs={"uselist": False})


class Geolocation(SQLModel, table=True):
    geo_location_id: UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, nullable=False)
    name: str = Field(index=True, nullable=False)
    latitude: float = Field(index=True, nullable=False)
    longitude: float = Field(index=True, nullable=False)
    description: str = Field(index=True, nullable=False)


class LocalGuide(SQLModel, table=True):
    guide_id: UUID = Field(default_factory=uuid.uuid4,
                           primary_key=True, nullable=False)
    id_image1: str = Field(index=True, nullable=False)
    id_image2: str = Field(index=True, nullable=False)
    name: str = Field(index=True, nullable=False)
    age: int = Field(nullable=False)
    address: int = Field(index=True, nullable=False)
    contact: int = Field(index=True, nullable=False)
    email: EmailStr = Field(index=True, nullable=False)
    bio: str = Field(index=True, nullable=False)
    language: str = Field(index=True, nullable=False)

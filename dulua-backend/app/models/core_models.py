
from re import L
from typing import List, Optional


from fastapi import UploadFile
from pydantic import BaseModel, EmailStr
from sqlalchemy import null
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
    reviews: list["Review"] = Relationship(back_populates="place")


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


class Review(SQLModel, table=True):
    review_id: UUID = Field(default_factory=uuid.uuid4,
                            primary_key=True, nullable=False)
    tourist_id: UUID = Field(default_factory=uuid.uuid4,
                             primary_key=True, nullable=False)
    place_id: UUID = Field(foreign_key="place.place_id", nullable=False)
    place: Optional["Place"] = Relationship(back_populates="reviews")
    rating: float = Field(nullable=False)
    comment: str = Field(nullable=False)
    timestamp: str = Field(nullable=False)
    images: List["ImageData"] = Relationship(back_populates="review")


class ImageData(SQLModel, table=True):
    image_id: UUID = Field(default_factory=uuid.uuid4,
                           primary_key=True, nullable=False)
    image: str = Field(index=True, nullable=False)
    place_id: UUID = Field(nullable=False)
    review_id: UUID = Field(foreign_key="review.review_id", nullable=False)
    review: Optional["Review"] = Relationship(back_populates="images")


class ReviewCreate(BaseModel):
    place_id: UUID
    tourist_id: UUID
    rating: float
    comment: str
    timestamp: str


class ReviewPublic(ReviewCreate):
    images: List[str]

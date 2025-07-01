
from enum import Enum
from re import L
from typing import List, Optional
from matplotlib import category
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


class CategoryEnum(str, Enum):
    must_visit = "must_visit"
    panaroma = "panaroma"
    hike = "hike"
    camp = "camp"
    remote = "remote"
    gem = "gem"
    adventure = "adventure"
    food = "food"
    shop = "shop"
    sightseeing = "sightseeing"
    culture = "culture"
    art = "art"
    history = "history"
    nature = "nature"
    sport = "sport"
    religion = "religion"
    education = "education"
    health = "health"
    entertainment = "entertainment"
    transportation = "transportation"
    other = "other"


class PublicCity(GeolocationCreate):
    city_id: UUID


class CategoryRead(BaseModel):
    id: UUID
    name: CategoryEnum

    class Config:
        from_attributes = True


class PublicPlace(GeolocationCreate):
    city_id: UUID
    city_name: str
    category: List[CategoryRead]
    featured: bool
    featured_image_main: str
    featured_image_secondary:  Optional[str] = None


class City(SQLModel, table=True):
    city_id: UUID = Field(default_factory=uuid.uuid4,
                          primary_key=True, nullable=False)

    geo_location_id: UUID = Field(
        foreign_key="geolocation.geo_location_id", nullable=False, unique=True)

    geo_location: Optional["Geolocation"] = Relationship(
        sa_relationship_kwargs={"uselist": False})
    places: list["Place"] = Relationship(back_populates="city")


class PlaceCategoryLink(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4,
                     primary_key=True, nullable=False)
    place_id: UUID = Field(foreign_key="place.place_id", nullable=False)
    category_id: UUID = Field(foreign_key="category.id", nullable=False)


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
    categories: List["Category"] = Relationship(back_populates="places",
                                                link_model=PlaceCategoryLink)
    featured: bool = Field(default=False, nullable=False)
    featured_image_main: str = Field(nullable=False)
    featured_image_secondary: str = Field(nullable=True)


# cateogry place, m-m relationship
class Category(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4,
                     primary_key=True, nullable=False)
    name: CategoryEnum = Field(index=True, nullable=False)
    places: list["Place"] = Relationship(back_populates="categories",
                                         link_model=PlaceCategoryLink)


class CategoryCreate(BaseModel):
    name: CategoryEnum


class Geolocation(SQLModel, table=True):
    geo_location_id: UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, nullable=False)
    name: str = Field(index=True, nullable=False)
    latitude: float = Field(index=True, nullable=False)
    longitude: float = Field(index=True, nullable=False)
    description: str = Field(index=True, nullable=False)


class PlaceAdd(GeolocationCreate):
    city_id: UUID
    category: List[CategoryEnum]
    featured: Optional[bool] = False
    featured_image_main: str
    featured_image_secondary: Optional[str] = None


class LocalGuide(SQLModel, table=True):
    guide_id: UUID = Field(default_factory=uuid.uuid4,
                           primary_key=True, nullable=False)
    id_image1: str = Field(index=True, nullable=False)
    id_image2: str = Field(index=True, nullable=False)
    name: str = Field(index=True, nullable=False)
    age: int = Field(nullable=False)
    address: str = Field(index=True, nullable=False)
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

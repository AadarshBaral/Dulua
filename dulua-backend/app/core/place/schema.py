
from enum import Enum
from typing import List, Optional, TYPE_CHECKING
from pydantic import BaseModel
from uuid import UUID

from app.core.city.schema import GeolocationCreate

if TYPE_CHECKING:
    from app.auth.models import UserDB


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


class CategoryRead(BaseModel):
    id: UUID
    name: CategoryEnum

    class Config:
        from_attributes = True


class PublicPlace(GeolocationCreate):
    place_id: UUID
    city_id: UUID
    city_name: str
    category: List[CategoryRead]
    featured: bool
    featured_image_main: str
    featured_image_secondary:  Optional[str] = None


class CategoryCreate(BaseModel):
    name: CategoryEnum


class PlaceAdd(GeolocationCreate):
    city_id: UUID
    category: List[CategoryEnum]
    featured: Optional[bool] = False
    featured_image_main: str
    featured_image_secondary: Optional[str] = None


class ReviewCreate(BaseModel):
    place_id: UUID
    tourist_id: UUID
    rating: float
    cleanliness: float
    comment: str
    timestamp: str


class ReviewPublic(ReviewCreate):
    images: List[str]

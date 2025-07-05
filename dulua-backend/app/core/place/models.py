
from typing import List, Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel  # type: ignore
import uuid
from uuid import UUID
from .schema import CategoryEnum, PublicPlace
from app.core.city.models import Geolocation, City

if TYPE_CHECKING:
    from app.auth.models import UserDB


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

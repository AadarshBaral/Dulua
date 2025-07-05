from uuid import UUID
from pydantic import BaseModel


class GeolocationCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    description: str


class PublicCity(GeolocationCreate):
    city_id: UUID

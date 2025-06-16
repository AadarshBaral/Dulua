from uuid import UUID
from app.session import get_session
from fastapi import HTTPException, UploadFile, File, APIRouter, Depends
from typing import Annotated
from sqlmodel import Session, select
from app.models.core_models import City, Geolocation, GeolocationCreate, Place, PublicCity, PublicPlace

router = APIRouter()


@router.post("/add_geo_location")
async def add_city(geo_location: Geolocation, session: Session = Depends(get_session)):
    session.add(geo_location)
    session.commit()
    return {"message": "Geo Location added", "geo_location": geo_location.dict()}


@router.post("/add_city")
async def add_city(city: City, session: Session = Depends(get_session)):
    if isinstance(city.geo_location_id, str):
        city.geo_location_id = UUID(city.geo_location_id)

    session.add(city)
    session.commit()
    return {"message": "City added", "city": city.dict()}


@router.post("/add_place")
async def add_place(place: Place, session: Session = Depends(get_session)):
    if isinstance(place.geo_location_id, str):
        place.geo_location_id = UUID(place.geo_location_id)
    if isinstance(place.city_id, str):
        place.city_id = UUID(place.city_id)
    session.add(place)
    session.commit()
    return {"message": "Place added", "place": place.dict()}


@router.get("/get_city/{city_id}", response_model=PublicCity)
async def get_city(city_id: UUID, session: Session = Depends(get_session)):
    city = session.exec(select(City).where(City.city_id == city_id)).first()
    if not city:
        raise HTTPException(status_code=400, detail="City not found")
    geo_location = session.exec(select(Geolocation).where(
        Geolocation.geo_location_id == city.geo_location_id)).first()

    city_result = PublicCity(city_id=city.city_id, name=geo_location.name, latitude=geo_location.latitude,
                             longitude=geo_location.longitude, description=geo_location.description)

    return city_result


@router.get("/get_place/{place_id}", response_model=PublicPlace)
async def get_place(place_id: UUID, session: Session = Depends(get_session)):
    place = session.exec(select(Place).where(
        Place.place_id == place_id)).first()
    if not place:
        raise HTTPException(status_code=400, detail="Place not found")
    geo_location = session.exec(select(Geolocation).where(
        Geolocation.geo_location_id == place.geo_location_id)).first()
    city = session.exec(select(City).where(
        Place.city_id == place.city_id)).first()

    place_result = PublicPlace(city_id=city.city_id, city_name=city.geo_location.name, name=geo_location.name, latitude=geo_location.latitude,
                               longitude=geo_location.longitude, description=geo_location.description)

    return place_result

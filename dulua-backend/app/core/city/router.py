from sqlmodel import select, Session  # type: ignore
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from app.session import get_session
from fastapi import HTTPException, APIRouter, Depends
from .models import City, Geolocation
from .schema import GeolocationCreate, PublicCity
router = APIRouter()


@router.post("/add_city")
async def add_city(city: GeolocationCreate, session: Session = Depends(get_session)):
    geo_location = Geolocation(name=city.name, latitude=city.latitude,
                               longitude=city.longitude, description=city.description)
    # TODO: need to check with lat,lng threshold whether another geolocation can be added. Cannot add if threshold limit matches
    existing = session.query(Geolocation).filter(
        Geolocation.latitude == geo_location.latitude and Geolocation.longitude == geo_location.longitude).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="Geolocation already exists")

    session.add(geo_location)
    session.commit()
    city = City(geo_location_id=geo_location.geo_location_id,
                name=city.name)
    session.add(city)
    session.commit()
    return {"message": "Geolocation added", "geo_location": geo_location.dict()}


@router.get("/all_cities")
# TODO: Add support to multiple cities when scaling, we will be adding pokhara as first city
def all_cities(session: Session = Depends(get_session)):
    city = session.exec(select(City)).first()
    geo_location = session.exec(select(Geolocation).where(
        Geolocation.geo_location_id == city.geo_location_id)).first()

    return {"city_id": city.city_id, "name": geo_location.name}


@router.get("/{city_id}", response_model=PublicCity)
async def get_city(city_id: UUID, session: Session = Depends(get_session)):
    city = session.exec(select(City).where(City.city_id == city_id)).first()
    if not city:
        raise HTTPException(status_code=400, detail="City not found")
    geo_location = session.exec(select(Geolocation).where(
        Geolocation.geo_location_id == city.geo_location_id)).first()

    city_result = PublicCity(city_id=city.city_id, name=geo_location.name, latitude=geo_location.latitude,
                             longitude=geo_location.longitude, description=geo_location.description)

    return city_result

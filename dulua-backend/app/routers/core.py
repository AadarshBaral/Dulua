from fastapi.staticfiles import StaticFiles
from uuid import UUID
import uuid
from app.session import get_session
from fastapi import Form, HTTPException, UploadFile, File, APIRouter, Depends
from typing import Annotated, List
from sqlmodel import Session, select
from app.models.core_models import City, Geolocation, GeolocationCreate, ImageData, Place, PublicCity, PublicPlace, Review, ReviewCreate, ReviewPublic
from pathlib import Path
import shutil
from fastapi import Request
router = APIRouter()


UPLOAD_DIR = Path("uploads/reviews")
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)


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


@router.post("/add_review")
async def add_review(
    place_id: str = Form(...),
    tourist_id: str = Form(...),
    rating: int = Form(...),
    comment: str = Form(...),
    timestamp: str = Form(...),
    images: List[UploadFile] = File([]),
    session: Session = Depends(get_session)
):

    place_uuid = UUID(place_id)
    tourist_uuid = UUID(tourist_id)

    review = Review(
        place_id=place_uuid,
        tourist_id=tourist_uuid,
        rating=rating,
        comment=comment,
        timestamp=timestamp
    )
    session.add(review)
    session.commit()
    session.refresh(review)

    for image in images:
        print("Processing image")
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="File must be an image")

        ext = image.filename.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png"]:
            raise HTTPException(status_code=400, detail="Invalid image format")

        new_filename = f"{uuid.uuid4()}.{ext}"
        file_path = UPLOAD_DIR / new_filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        img_data = ImageData(
            image=new_filename, review_id=review.review_id, place_id=review.place_id)
        session.add(img_data)

    session.commit()

    return {"message": "Review added", "review_id": review.review_id}


@router.get("/get_reviews/{place_id}", response_model=List[ReviewPublic])
async def get_review(request: Request, place_id: UUID, session: Session = Depends(get_session)):
    baseurl = str(request.base_url).rstrip("/")
    review = session.exec(select(Review).where(Review.place_id == place_id))
    images = session.exec(select(ImageData).where(
        ImageData.place_id == place_id))

    reviews = []
    for rev in review:

        review_data = ReviewPublic(
            place_id=rev.place_id,
            tourist_id=rev.tourist_id,
            rating=rev.rating,
            comment=rev.comment,
            timestamp=rev.timestamp,
            images=[f"{baseurl}/images/reviews/{ImageData(**img.dict()).image}"
                    for img in images if img.review_id == rev.review_id]
        )
        reviews.append(review_data)

    return reviews

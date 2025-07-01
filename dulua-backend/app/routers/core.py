import os
import uuid

from sqlmodel import select, Session
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from uuid import uuid4, UUID
from pydantic import Field, EmailStr

from pydantic import BaseModel


from app.session import get_session
from fastapi import Form, HTTPException, UploadFile, File, APIRouter, Depends
import os
from app.models.core_models import Category, CategoryCreate, CategoryEnum, CategoryRead, City, Geolocation, GeolocationCreate, ImageData, Place, PlaceAdd, PublicCity, PublicPlace, Review, ReviewCreate, ReviewPublic, LocalGuide, verifyRequest
from pathlib import Path
import shutil
from fastapi import Request

router = APIRouter()


UPLOAD_DIR = Path("uploads/reviews")
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

UPLOAD_localguide = Path("uploads/localguide")
UPLOAD_localguide.mkdir(exist_ok=True, parents=True)
PLACE_UPLOAD_DIR = Path("uploads/places")
PLACE_UPLOAD_DIR.mkdir(exist_ok=True, parents=True)


@router.post("/add_geo_location")
async def add_city(geo_location: Geolocation, session: Session = Depends(get_session)):
    session.add(geo_location)
    session.commit()
    return {"message": "Geo Location added", "geo_location": geo_location.dict()}


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


@router.post("/add_place")
async def add_place(
    name: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    description: str = Form(...),
    city_id: UUID = Form(...),
    category: List[CategoryEnum] = Form(...),
    featured: bool = Form(False),
    featured_image_main: UploadFile = File(...),
    featured_image_secondary: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session)
):
    # ✅ Step 1: Save images
    def save_image(image: UploadFile) -> str:
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="File must be an image")

        ext = image.filename.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png"]:
            raise HTTPException(status_code=400, detail="Invalid image format")

        new_filename = f"{uuid.uuid4()}.{ext}"
        filepath = PLACE_UPLOAD_DIR / new_filename

        with filepath.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        return new_filename  # store only the filename, not full path

    main_image_filename = save_image(featured_image_main)
    secondary_image_filename = save_image(
        featured_image_secondary) if featured_image_secondary else None

    # ✅ Step 2: Create Geolocation
    geo_location = Geolocation(
        name=name,
        latitude=latitude,
        longitude=longitude,
        description=description
    )
    session.add(geo_location)
    session.commit()
    session.refresh(geo_location)

    # ✅ Step 3: Fetch existing categories
    existing_categories = session.exec(
        select(Category).where(Category.name.in_(category))
    ).all()

    if not existing_categories:
        raise HTTPException(
            status_code=400, detail="No matching categories found")

    # ✅ Step 4: Create Place
    new_place = Place(
        city_id=city_id,
        geo_location_id=geo_location.geo_location_id,
        categories=existing_categories,
        featured=featured,
        featured_image_main=main_image_filename,
        featured_image_secondary=secondary_image_filename
    )
    session.add(new_place)
    session.commit()
    session.refresh(new_place)

    return {
        "message": "Place added successfully",
        "place_id": new_place.place_id,
        "main_image": main_image_filename,
        "secondary_image": secondary_image_filename,
    }


@router.post("/add_category")
async def add_category(category: CategoryCreate, session: Session = Depends(get_session)):
    existing = session.query(Category).filter(
        Category.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    session.add(Category(name=category.name))
    session.commit()

    return {"message": "Category added", "category": category.dict()}


@router.get("/all_cities")
def all_cities(session: Session = Depends(get_session)):
    city = session.exec(select(City)).first()
    geo_location = session.exec(select(Geolocation).where(
        Geolocation.geo_location_id == city.geo_location_id)).first()

    return {"city_id": city.city_id, "name": geo_location.name}


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
async def get_place(request: Request, place_id: UUID, session: Session = Depends(get_session)):
    baseurl = str(request.base_url).rstrip("/")
    place = session.exec(select(Place).where(
        Place.place_id == place_id)).first()
    if not place:
        raise HTTPException(status_code=400, detail="Place not found")
    geo_location = session.exec(select(Geolocation).where(
        Geolocation.geo_location_id == place.geo_location_id)).first()
    city = session.exec(select(City).where(
        Place.city_id == place.city_id)).first()
    categories = [CategoryRead.model_validate(cat) for cat in place.categories]
    place_result = PublicPlace(
        city_id=city.city_id,
        city_name=city.geo_location.name,
        name=geo_location.name,
        latitude=geo_location.latitude,
        longitude=geo_location.longitude,
        description=geo_location.description,
        category=categories,
        featured=place.featured,
        featured_image_main=f"{baseurl}/city/images/places/{place.featured_image_main}",
        featured_image_secondary=f"{baseurl}/city/images/places/{place.featured_image_secondary}"

    )
    return place_result


@router.post("/local-guide")
async def add_local_guide(
        id_image1: UploadFile = File(...),
        id_image2: UploadFile = File(...),
        name: str = Form(...),
        age: int = Form(...),
        address: str = Form(...),
        contact: int = Form(...),
        email: EmailStr = Form(...),
        bio: str = Form(...),
        language: str = Form(...),
        session: Session = Depends(get_session)):

    check = session.exec(select(LocalGuide).where(
        LocalGuide.email == email)).first()
    if check:
        raise HTTPException(
            status_code=409, detail=f"Local guide with email={email} already exist")

    try:
        ext1 = os.path.splitext(id_image1.filename)[1]
        filename1 = f"{uuid4()}{ext1}"

        filepath1 = os.path.join(UPLOAD_localguide, filename1)
        with open(filepath1, "wb") as f1:
            content1 = await id_image1.read()
            f1.write(content1)

        ext2 = os.path.splitext(id_image2.filename)[1]
        filename2 = f"{uuid4()}{ext2}"
        filepath2 = os.path.join(UPLOAD_localguide, filename2)
        with open(filepath2, "wb") as f2:
            content2 = await id_image2.read()
            f2.write(content2)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to save images: {e}")

    # Create model instance from form fields
    guide = LocalGuide(
        id_image1=filepath1,
        id_image2=filepath2,
        name=name,
        age=age,
        address=address,
        contact=contact,
        email=email,
        bio=bio,
        language=language
    )

    session.add(guide)
    session.commit()
    session.refresh(guide)

    return {"message": "Local guide added", "guide": guide.dict()}


@router.get("/verifyLocalGuide")
async def verifyLocalGuide(data: verifyRequest, session: Session = Depends(get_session)):
    user = session.exec(select(LocalGuide).where(
        LocalGuide.guide_id == data.id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    session.add(user)
    session.commit()
    return {"message": "User verified as LocalGuide"}


@router.post("/add_review")
async def add_review(
    place_id: str = Form(...),
    tourist_id: str = Form(...),
    rating: int = Form(...),
    comment: str = Form(...),
    timestamp: str = Form(...),
    images: list[UploadFile] = File([]),
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

        new_filename = f"{UUID.uuid4()}.{ext}"
        file_path = UPLOAD_DIR / new_filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        img_data = ImageData(
            image=new_filename, review_id=review.review_id, place_id=review.place_id)
        session.add(img_data)

    session.commit()


@router.get("/get_reviews/{place_id}", response_model=list[ReviewPublic])
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


@router.get("/all_places", response_model=List[PublicPlace])
async def all_places(session: Session = Depends(get_session)):
    places = session.exec(select(Place)).all()
    print(places)
    if not places:
        raise HTTPException(status_code=400, detail="No places found")

    place_results = []

    for place in places:
        # Get related geo_location
        geo_location = session.exec(
            select(Geolocation).where(
                Geolocation.geo_location_id == place.geo_location_id)
        ).first()

        # Get related city
        city = session.exec(
            select(City).where(City.city_id == place.city_id)
        ).first()

        # Convert categories to response model
        categories = [CategoryRead.model_validate(
            cat) for cat in place.categories]

        place_result = PublicPlace(
            city_id=city.city_id,
            city_name=city.geo_location.name,
            name=geo_location.name,
            latitude=geo_location.latitude,
            longitude=geo_location.longitude,
            description=geo_location.description,
            category=categories,
            featured=place.featured,
            featured_image_main=place.featured_image_main,
            featured_image_secondary=place.featured_image_secondary
        )

        place_results.append(place_result)

    return place_results

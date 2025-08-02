from datetime import datetime
from app.dependencies import get_userID_from_token
import uuid
from sqlmodel import select, Session  # type: ignore
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from app.session import get_session
from fastapi import Form, HTTPException, UploadFile, File, APIRouter, Depends
from .models import Category, Geolocation, ImageData, Place,  Review
from app.auth.models import UserDB
from .schema import CategoryCreate, CategoryEnum, CategoryRead, PublicPlace, ReviewPublic
from app.core.city.models import City, Geolocation
from pathlib import Path
import shutil
from fastapi.responses import JSONResponse
from fastapi import Request
router = APIRouter()
UPLOAD_DIR = Path("uploads/reviews")
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)
PLACE_UPLOAD_DIR = Path("uploads/places")
PLACE_UPLOAD_DIR.mkdir(exist_ok=True, parents=True)


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

        return new_filename

    main_image_filename = save_image(featured_image_main)
    secondary_image_filename = save_image(
        featured_image_secondary) if featured_image_secondary else None

    geo_location = Geolocation(
        name=name,
        latitude=latitude,
        longitude=longitude,
        description=description
    )
    session.add(geo_location)
    session.commit()
    session.refresh(geo_location)

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


@router.get("/get_place/{place_id}", response_model=PublicPlace)
async def get_place(request: Request, place_id: UUID, session: Session = Depends(get_session)):
    print('hi', place_id)
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
        place_id=place.place_id,
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


@router.post("/add_review")
async def add_review(
    place_id: str = Form(...),
    rating: int = Form(...),
    cleanliness: int = Form(...),
    comment: str = Form(...),
    timestamp: str = Form(...),
    images: list[UploadFile] = File([]),
    session: Session = Depends(get_session),
    user_id: str = Depends(get_userID_from_token)
):
    # ✅ Validate place_id
    try:
        place_uuid = UUID(place_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid place_id format")

    # ✅ Validate rating and cleanliness
    if not (1 <= rating <= 5):
        raise HTTPException(
            status_code=400, detail="Rating must be between 1 and 5")
    if not (1 <= cleanliness <= 5):
        raise HTTPException(
            status_code=400, detail="Cleanliness must be between 1 and 5")

    # ✅ Validate comment
    if not comment.strip():
        raise HTTPException(status_code=400, detail="Comment cannot be empty")

    # ✅ Validate timestamp
    try:
        datetime.fromisoformat(timestamp)
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Invalid timestamp format. Must be ISO 8601.")
    statement_user = select(UserDB).where(UserDB.id == UUID(user_id))
    existing_user = session.exec(statement_user).first()
    print("lskjf", existing_user)
    # ✅ Save review
    review = Review(
        place_id=place_uuid,
        username=existing_user.name,
        rating=rating,
        cleanliness=cleanliness,
        comment=comment,
        timestamp=timestamp
    )
    session.add(review)
    session.commit()
    session.refresh(review)

    # ✅ Validate and save images
    for image in images:
        if image.filename == "":
            continue  # skip empty input

        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="Only image files are allowed")

        ext = image.filename.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png"]:
            raise HTTPException(
                status_code=400, detail="Only JPG, JPEG, or PNG images are supported")

        new_filename = f"{uuid.uuid4()}.{ext}"
        file_path = UPLOAD_DIR / new_filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        img_data = ImageData(
            image=new_filename,
            review_id=review.review_id,
            place_id=review.place_id
        )
        session.add(img_data)

    session.commit()

    return JSONResponse(
        status_code=201,
        content={
            "message": "Review added successfully"
        }
    )


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
            username=rev.username,
            rating=rev.rating,
            cleanliness=rev.cleanliness,
            comment=rev.comment,
            timestamp=rev.timestamp,
            images=[f"{baseurl}/images/reviews/{ImageData(**img.dict()).image}"
                    for img in images if img.review_id == rev.review_id]
        )
        reviews.append(review_data)

    return reviews


@router.get("/all_places", response_model=List[PublicPlace])
async def all_places(request: Request, session: Session = Depends(get_session)):
    places = session.exec(select(Place)).all()
    baseurl = str(request.base_url).rstrip("/")
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
            place_id=place.place_id,
            city_id=city.city_id,
            city_name=city.geo_location.name,
            name=geo_location.name,
            latitude=geo_location.latitude,
            longitude=geo_location.longitude,
            description=geo_location.description,
            category=categories,
            featured=place.featured,
            featured_image_main=f"{baseurl}/city/images/places/{place.featured_image_main}",
            featured_image_secondary=f"{baseurl}/city/images/places/{place.featured_image_secondary}",
        )

        place_results.append(place_result)

    return place_results

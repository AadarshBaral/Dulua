from datetime import datetime
from email.mime import image
from app.dependencies import get_userID_from_token, role_required
import uuid
import os
from sqlmodel import select, Session  # type: ignore
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from app.session import get_session
from fastapi import Form, HTTPException, UploadFile, File, APIRouter, Depends
from .models import Category, Geolocation, ImageData, Place,  Review, Bookmark
from app.auth.models import UserDB
from .schema import CategoryCreate, CategoryEnum, CategoryRead, PublicPlace, ReviewPublic, BookmarkRequest
from app.core.city.models import City, Geolocation
from pathlib import Path
import shutil
from fastapi.responses import JSONResponse
from fastapi import Request
from app.core.userprofile.models import UserProfile
from app.dependencies import get_my_profile
from app.core.trash_detection.trash_dep import detect_trash
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
    session: Session = Depends(get_session),
    role: str = Depends(role_required("admin"))
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

    # ✅ Step 3: Handle Categories (create missing ones)
    existing_categories = session.exec(
        select(Category).where(Category.name.in_(category))
    ).all()

    existing_category_names = {c.name for c in existing_categories}
    missing_categories = set(category) - existing_category_names

    new_categories = []
    for missing in missing_categories:
        new_category = Category(name=missing)
        session.add(new_category)
        new_categories.append(new_category)

    if new_categories:
        session.commit()
        for c in new_categories:
            session.refresh(c)

    all_categories = existing_categories + new_categories

    # ✅ Step 4: Create Place
    new_place = Place(
        city_id=city_id,
        geo_location_id=geo_location.geo_location_id,
        categories=all_categories,
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
        "newly_created_categories": list(missing_categories)
    }


@router.post("/add_category")
async def add_category(category: CategoryCreate, session: Session = Depends(get_session), role: str = Depends(role_required("admin"))):
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
    user_id: str = Depends(get_userID_from_token),
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

    # ✅ Get user info
    user_stmt = select(UserDB).where(UserDB.id == user_id)
    existing_user = session.exec(user_stmt).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ Get user's profile info (to include profile image)
    profile_stmt = select(UserProfile).where(UserProfile.userdb_id == user_id)
    user_profile = session.exec(profile_stmt).first()
    user_profile_image = user_profile.image if user_profile and user_profile.image else None

    # ✅ Create new review
    review = Review(
        place_id=place_uuid,
        username=existing_user.name,
        profile_image=user_profile_image,  # ✅ Save profile image reference here
        rating=rating,
        cleanliness=cleanliness,
        comment=comment,
        timestamp=timestamp,
        trash_flag=0,
    )

    session.add(review)
    session.commit()
    session.refresh(review)

    # ✅ Process uploaded images
    trash_found = False
    detection_results = []

    for image in images:
        if not image.filename:
            continue

        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="Only image files are allowed")

        ext = image.filename.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png"]:
            raise HTTPException(
                status_code=400, detail="Only JPG, JPEG, or PNG images are supported")

        # ✅ Save uploaded image
        new_filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        image_bytes = await image.read()

        with open(file_path, "wb") as buffer:
            buffer.write(image_bytes)

        # ✅ Save the original uploaded image
        img_data = ImageData(
            image_path=new_filename,
            review_id=review.review_id,
            place_id=review.place_id,
            is_trash=False,
        )
        session.add(img_data)

        # ✅ Run YOLO detection
        detection_result = await detect_trash(new_filename, image_bytes)
        detection_results.append(detection_result)

        detected_class = detection_result.get("detected_class", [])
        annotated_path = detection_result.get("saved_path")

        if detected_class:
            trash_found = True
            trash_img_data = ImageData(
                image_path=os.path.basename(annotated_path),
                review_id=review.review_id,
                place_id=review.place_id,
                detected_class=", ".join(detected_class),
                annotated_path=annotated_path,
                is_trash=True,
            )
            session.add(trash_img_data)

    if trash_found:
        review.trash_flag = 1

    session.commit()
    session.refresh(review)

    return JSONResponse(
        status_code=201,
        content={
            "message": "Review added successfully",
            "review_id": str(review.review_id),
            "username": existing_user.name,
            "profile_image": user_profile_image,  # ✅ Return user profile image too
            "trash_flag": review.trash_flag,
            "detections": detection_results,
        },
    )


@router.get("/get_reviews/{place_id}", response_model=list[ReviewPublic])
async def get_reviews(request: Request, place_id: UUID, session=Depends(get_session)):
    baseurl = str(request.base_url).rstrip("/")

    # ✅ Get all reviews for this place
    reviews_result = session.exec(
        select(Review).where(Review.place_id == place_id)
    ).all()

    # ✅ Get all related images for this place
    images = list(session.exec(
        select(ImageData).where(ImageData.place_id == place_id)
    ))

    reviews = []

    for rev in reviews_result:
        # ✅ Normal (non-trash) images
        normal_images = [
            f"{baseurl}/city/images/reviews/{img.image_path}"
            for img in images
            if img.review_id == rev.review_id and not img.is_trash
        ]

        # ✅ Trash images: return both URL + detected classes
        trash_data = [
            {
                "image_url": f"{baseurl}/city/images/reviews/trash/{os.path.basename(img.annotated_path)}",
                "detected_class": img.detected_class.split(", ") if img.detected_class else [],
            }
            for img in images
            if img.review_id == rev.review_id and img.is_trash and img.annotated_path
        ]

        # ✅ Construct full profile image URL if available
        profile_image_url = (
            f"{baseurl}{rev.profile_image}"
            if rev.profile_image and not rev.profile_image.startswith("http")
            else rev.profile_image
        )

        # ✅ Build the final review response
        review_data = {
            "place_id": rev.place_id,
            "username": rev.username,
            "profile_image": profile_image_url,   # ✅ Added field
            "rating": rev.rating,
            "cleanliness": rev.cleanliness,
            "comment": rev.comment,
            "timestamp": rev.timestamp,
            "trash_flag": rev.trash_flag,
            "images": normal_images,
            "trash_images": [t["image_url"] for t in trash_data],
            "trash_data": trash_data,  # ✅ Includes both URL + class labels
        }

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


@router.post("/bookmark")
def toggle_bookmark(
    data: BookmarkRequest,
    session: Session = Depends(get_session),
    current_user: UserProfile = Depends(get_my_profile),
):
    place_id = data.place_id

    # Check if bookmark already exists
    bookmark = session.exec(
        select(Bookmark).where(
            Bookmark.user_profile_id == current_user.id,
            Bookmark.place_id == place_id
        )
    ).first()

    if bookmark:
        # Bookmark exists → remove it
        session.delete(bookmark)
        session.commit()
        return {"status": "removed", "place_id": place_id}

    # Otherwise, add new one
    new_bookmark = Bookmark(
        user_profile_id=current_user.id,
        place_id=place_id
    )
    session.add(new_bookmark)
    session.commit()
    return {"status": "added", "place_id": place_id}


@router.get("/is_bookmarked/{place_id}")
def is_bookmarked(place_id: UUID, session: Session = Depends(get_session), current_user: UserProfile = Depends(get_my_profile),):
    bookmark = session.exec(
        select(Bookmark).where(
            Bookmark.user_profile_id == current_user.id,
            Bookmark.place_id == place_id
        )
    ).first()
    return {"bookmarked": bool(bookmark)}


@router.get("/bookmarks", response_model=List[PublicPlace])
def get_bookmarks(
    request: Request,
    current_user: UserProfile = Depends(get_my_profile),
    session: Session = Depends(get_session)
):
    bookmarks = session.exec(
        select(Bookmark)
        .where(Bookmark.user_profile_id == current_user.id)
    ).all()

    if not bookmarks:
        raise HTTPException(status_code=404, detail="No bookmarks found")

    baseurl = str(request.base_url).rstrip("/")
    place_results = []

    for bookmark in bookmarks:
        place = session.exec(
            select(Place).where(Place.place_id == bookmark.place_id)
        ).first()
        if not place:
            continue

        # Get related geo_location
        geo_location = session.exec(
            select(Geolocation).where(
                Geolocation.geo_location_id == place.geo_location_id
            )
        ).first()

        # Get related city
        city = session.exec(
            select(City).where(City.city_id == place.city_id)
        ).first()

        # Categories
        categories = [
            CategoryRead.model_validate(cat)
            for cat in place.categories
        ]

        # Construct full object
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

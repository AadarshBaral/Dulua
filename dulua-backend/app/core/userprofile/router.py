from sqlmodel import select
from fastapi import HTTPException, Request
from fastapi import File, UploadFile, Form
import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from uuid import UUID
from typing import List
from app.core.userprofile.models import UserProfile
from app.core.place.models import Bookmark, Place
from app.session import get_session
from . schema import UserProfileUpdate
router = APIRouter(tags=["User Profile"])


@router.get("/userprofile/{user_profile_id}")
def get_user_profile(user_profile_id: UUID, session: Session = Depends(get_session)):
    profile = session.exec(
        select(UserProfile).where(UserProfile.id == user_profile_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    bookmarks = session.exec(
        select(Bookmark).where(Bookmark.user_profile_id == user_profile_id)
    ).all()

    places = [b.place for b in bookmarks]

    return {
        "id": profile.id,
        "image": profile.image,
        "contribution": profile.contribution,
        "green_points": profile.green_points,
        "bookmarked_places": [
            {
                "id": place.place_id,

            }
            for place in places
        ]
    }


@router.get("/{user_id}")
def get_user_profile_by_user_id(user_id: UUID, session: Session = Depends(get_session)):
    profile = session.exec(
        select(UserProfile).where(UserProfile.userdb_id == user_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    # Fetch bookmarks for this user
    bookmarks = session.exec(
        select(Bookmark).where(Bookmark.user_profile_id == profile.id)
    ).all()

    places = [b.place for b in bookmarks]

    return {
        "id": str(profile.id),
        "userdb_id": str(profile.userdb_id),
        "handle": profile.handle,
        "image": profile.image,
        "contribution": profile.contribution,
        "green_points": profile.green_points,
        "bookmarked_places": [
            {
                "id": str(place.place_id),
                "title": place.title if hasattr(place, "title") else None,
                "description": place.description if hasattr(place, "description") else None,
            }
            for place in places
        ],
    }


UPLOAD_DIR = "uploads/profile_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.put("/{user_id}")
async def update_user_profile_image(
    user_id: UUID,
    image: UploadFile = File(None),
    session: Session = Depends(get_session)
):
    profile = session.exec(
        select(UserProfile).where(UserProfile.userdb_id == user_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    if image:
        file_name = f"{user_id}_{image.filename}"
        file_path = os.path.join(UPLOAD_DIR, file_name)

        # Save file to local uploads folder
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # ✅ Save public URL path for frontend
        profile.image = f"/uploads/profile_images/{file_name}"

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile


@router.get("/{user_id}/image")
def get_profile_image_by_user_id(request: Request,
                                 user_id: UUID, session: Session = Depends(get_session)
                                 ):
    # Fetch the user profile by user_id
    profile = session.exec(
        select(UserProfile).where(UserProfile.userdb_id == user_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    # Check if the user has a profile image
    if not profile.image:
        raise HTTPException(status_code=404, detail="Profile image not found")

    return {"image_url": profile.iamge}

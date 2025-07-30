from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from typing import List
from app.core.userprofile.models import UserProfile
from app.core.place.models import Bookmark,Place
from app.session import get_session

router = APIRouter( tags=["User Profile"])

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

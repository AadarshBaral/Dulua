from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from typing import List
from app.core.userprofile.models import UserProfile
from app.core.place.models import Bookmark,Place
from app.session import get_session
from .schema import UpdateContributionRequest,UpdateGreenPointsRequest

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
        "handle": profile.handle,
        "name": profile.name,
        "email": profile.email,
        "image": profile.image,
        "country": profile.country,
        "contribution": profile.contribution,
        "green_points": profile.green_points,
        "bookmarked_places": [
            {
                "id": place.place_id,
               
            }
            for place in places
        ]
    }

@router.put("/userprofile/update-contribution")
def update_user_profile_contribution(
    update_data: UpdateContributionRequest,
    session: Session = Depends(get_session)
):
    profile = session.exec(
        select(UserProfile).where(UserProfile.id == update_data.user_profile_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    profile.contribution = update_data.contribution
    session.add(profile)
    session.commit()
    session.refresh(profile)

    return {"message": "Contribution updated successfully", "contribution": profile.contribution}


@router.put("/userprofile/update-greenpoints")
def update_user_profile_green_points(
    update_data: UpdateGreenPointsRequest,
    session: Session = Depends(get_session)
):
    profile = session.exec(
        select(UserProfile).where(UserProfile.id == update_data.user_profile_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    profile.green_points = update_data.green_points
    session.add(profile)
    session.commit()
    session.refresh(profile)

    return {"message": "Green points updated successfully", "green_points": profile.green_points}

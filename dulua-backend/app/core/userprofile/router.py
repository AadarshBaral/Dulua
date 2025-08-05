from anyio import Path
from fastapi import APIRouter, Depends, HTTPException,Form,File,UploadFile
from sqlmodel import Session, select
from uuid import UUID
from typing import List
from app.core.userprofile.models import UserProfile
from app.core.place.models import Bookmark,Place
from app.session import get_session
from .schema import UpdateContributionRequest,UpdateGreenPointsRequest
import os
from app.dependencies import get_my_profile


UPLOAD_USER_IMG=Path("uploads/userprofile")
UPLOAD_USER_IMG.mkdir(exist_ok=True, parents=True)

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



@router.patch("/userprofile/update")
async def update_user_profile(
    handle: str = Form(None),
    name: str = Form(None),
    country: str = Form(None),
    image: UploadFile = File(None),
    current_user: UserProfile = Depends(get_my_profile),
    session: Session = Depends(get_session)
):
    
    user_profile_id=current_user.id
    # Fetch user
    profile = session.exec(
        select(UserProfile).where(UserProfile.id == user_profile_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    # Update basic fields
    if handle:
        profile.handle = handle
    if name:
        profile.name = name
    if country:
        profile.country = country

    # Handle image upload and old image deletion
    if image:
        # Create upload directory if not exists
        os.makedirs(UPLOAD_USER_IMG, exist_ok=True)

        # Create new unique filename
        new_filename = f"{user_profile_id}_{image.filename}"
        new_file_path = os.path.join(UPLOAD_USER_IMG, new_filename)

        # Save the new image file
        with open(new_file_path, "wb") as f:
            f.write(await image.read())

        # Delete the old image if it exists and is different
        if profile.image and os.path.exists(profile.image):
            try:
                os.remove(profile.image)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to delete old image: {str(e)}")

        # Update DB path to new image
        profile.image = new_file_path

    # Save changes
    session.add(profile)
    session.commit()
    session.refresh(profile)

    return profile
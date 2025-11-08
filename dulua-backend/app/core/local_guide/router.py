from app.core.userprofile.models import UserProfile
import os
from typing import List
from sqlmodel import select, Session  # type: ignore
from fastapi import APIRouter, Depends, HTTPException
from uuid import uuid4, UUID
from pydantic import EmailStr
from app.auth.models import UserDB
from app.session import get_session
from fastapi import Form, HTTPException, UploadFile, File, APIRouter, Depends
import os
from app.core.local_guide.models import LocalGuide
from pathlib import Path
from fastapi import Request
from app.dependencies import get_email_from_token, get_role_from_token, get_userID_from_token
router = APIRouter()

UPLOAD_localguide = Path("uploads/localguide")
UPLOAD_localguide.mkdir(exist_ok=True, parents=True)


@router.post("/add")
async def add_local_guide(
        request: Request,
        id_image1: UploadFile = File(...),
        id_image2: UploadFile = File(...),
        name: str = Form(...),
        age: int = Form(...),
        address: str = Form(...),
        place_id: UUID = Form(...),
        contact: int = Form(...),
        email: EmailStr = Form(...),
        session: Session = Depends(get_session)):

    checkEmail = get_email_from_token(request)

    print("here is email", checkEmail)
    if checkEmail != email:
        raise HTTPException(
            status_code=403, detail=f"Curent User Email doesnot match entered email")

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
        bio="",
        language="",
        user_id=get_userID_from_token(request),
        place_id=place_id

    )

    session.add(guide)
    session.commit()
    session.refresh(guide)

    return {"message": "Local guide added", "guide": guide.dict()}


@router.get("/verifyLocalGuide/{id}")
async def verifyLocalGuide(id: UUID, request: Request, session: Session = Depends(get_session)):
    role = get_role_from_token(request)
    if role != "admin":
        raise HTTPException(
            status_code=403, detail="Only admin can verify localguide")

    user = session.exec(select(UserDB).where(UserDB.id == id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ Find the LocalGuide linked to this user
    guide = session.exec(select(LocalGuide).where(
        LocalGuide.user_id == id)).first()
    if not guide:
        raise HTTPException(
            status_code=404, detail="Local guide record not found")

    # ✅ Change user role and set status = True
    user.role = "guide"
    guide.status = True

    session.add(user)
    session.add(guide)
    session.commit()

    return {"message": f"Guide {guide.name} verified successfully"}


@router.get("/getLocalGuide/{guide_id}")
async def get_local_guide(guide_id: UUID, session: Session = Depends(get_session)):
    # Fetch the LocalGuide data
    guide = session.exec(select(LocalGuide).where(
        LocalGuide.guide_id == guide_id)).first()

    if not guide:
        raise HTTPException(status_code=404, detail="Local guide not found")

    # Fetch the associated UserProfile using the user_id in LocalGuide
    user_profile = session.exec(select(UserProfile).where(
        UserProfile.userdb_id == guide.user_id)).first()

    if not user_profile or not user_profile.image:
        raise HTTPException(
            status_code=404, detail="User profile image not found")

    # Return the LocalGuide data along with the profile image from the UserProfile table
    return {
        "guide_id": guide.guide_id,
        "name": guide.name,
        "age": guide.age,
        "address": guide.address,
        "contact": guide.contact,
        "profile_image": user_profile.image,
    }

# Use dict to customize response


@router.get("/getAllLocalGuides/{place_id}", response_model=List[dict])
async def get_all_local_guides(
    place_id: UUID, session: Session = Depends(get_session)
):
    # Fetch all active local guides for a specific place (status = True)
    guides = session.exec(
        select(LocalGuide).where(
            LocalGuide.status == True, LocalGuide.place_id == place_id
        )
    ).all()
    print("backend", guides)
    if not guides:
        raise HTTPException(status_code=404, detail="No active guides found")

    result = []

    for guide in guides:
        # Fetch the UserProfile using user_id in LocalGuide
        user_profile = session.exec(
            select(UserProfile).where(UserProfile.userdb_id == guide.user_id)
        ).first()

        # Check if profile image exists in UserProfile
        profile_image = user_profile.image if user_profile else "/default.png"

        # Append guide data along with the profile image URL
        result.append({
            "guide_id": guide.guide_id,
            "name": guide.name,
            "age": guide.age,
            "address": guide.address,
            "contact": guide.contact,
            "profile_image": profile_image  # Add profile image from UserProfile
        })

    return result


@router.get("/getAllLocalGuidesAdmin", response_model=List[LocalGuide])
async def getAllLocalGuides(session: Session = Depends(get_session)):
    guides = session.exec(select(LocalGuide))
    return guides


@router.put("/disableLocalGuide/{guide_id}")
async def disableLocalGuide(
    guide_id: UUID,
    request: Request,
    session: Session = Depends(get_session)
):
    role = get_role_from_token(request)
    if role != "admin":
        raise HTTPException(
            status_code=403, detail="Only admin can disable users")

    guide = session.exec(select(LocalGuide).where(
        LocalGuide.guide_id == guide_id)).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Local guide not found")

    # ✅ Mark as inactive (soft disable)
    guide.status = False

    # Optionally downgrade user role
    user = session.exec(select(UserDB).where(
        UserDB.id == guide.user_id)).first()
    if user and user.role == "guide":
        user.role = "user"

    session.add(guide)
    session.add(user)
    session.commit()

    return {"message": f"LocalGuide with id:{guide_id} has been disabled (soft deactivated)"}


@router.delete("/deleteLocalGuide/{guide_id}")
async def deleteLocalGuide(
    guide_id: UUID,
    request: Request,
    session: Session = Depends(get_session)
):
    role = get_role_from_token(request)
    if role != "admin":
        raise HTTPException(
            status_code=403, detail="Only admin can delete users")

    guide = session.exec(select(LocalGuide).where(
        LocalGuide.guide_id == guide_id)).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Local guide not found")

    # ⚠️ Permanent delete from DB
    session.delete(guide)
    session.commit()

    # Optionally downgrade user role too
    user = session.exec(select(UserDB).where(
        UserDB.id == guide.user_id)).first()
    if user and user.role == "guide":
        user.role = "user"
        session.add(user)
        session.commit()

    return {"message": f"LocalGuide with id:{guide_id} permanently deleted from system"}


@router.get("/checkIfLocalGuide", response_model=dict)
async def check_if_local_guide(request: Request, session: Session = Depends(get_session)):
    # Get user email from the token
    email_from_token = get_email_from_token(request)

    # Query to find if the user already exists in LocalGuide table
    guide = session.exec(select(LocalGuide).where(
        LocalGuide.email == email_from_token)).first()

    # If the user is found in the LocalGuide table, return True
    if guide:
        return {"can_fill_form": False, "message": "You are already a local guide."}

    return {"can_fill_form": True, "message": "You can fill the form to become a local guide."}

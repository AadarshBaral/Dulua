import os
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


@router.post("/local-guide")
async def add_local_guide(
        request: Request,
        id_image1: UploadFile = File(...),
        id_image2: UploadFile = File(...),
        name: str = Form(...),
        age: int = Form(...),
        address: str = Form(...),
        contact: int = Form(...),
        email: EmailStr = Form(...),
        session: Session = Depends(get_session)):

    checkEmail = get_email_from_token(request)
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
        user_id=UUID(get_userID_from_token(request))

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
    user.role = "guide"
    session.add(user)
    session.commit()
    return {"Message": "Guide Verified"}


@router.post("/getLocalGuide/{guide_id}")
async def getLocalGuide(guide_id: UUID, session: Session = Depends(get_session)):
    guide = session.exec(select(LocalGuide).where(
        LocalGuide.guide_id == guide_id)).first()
    print(guide_id)
    print(guide)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    return {"Guide Data": guide}


@router.delete("deleteLocalGuide/{guide_id}")
async def deleteLocalGuide(guide_id: UUID, request: Request, session: Session = Depends(get_session)):
    role = get_role_from_token(request)
    if role != "admin":
        raise HTTPException(
            status_code=403, detail="Only admin can delete users")
    user = session.exec(select(LocalGuide).where(
        LocalGuide.guide_id == guide_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"message": f"LocalGuide with id:{guide_id} deleted "}

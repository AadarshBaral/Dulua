from fastapi import Header, HTTPException, Request,Depends
import jwt
from sympy import im
from typing_extensions import Annotated
from sqlmodel import Session, select
from .config import settings
from app.core.userprofile.models import UserProfile
from app.session import get_session
from uuid import UUID
import random
import string

SECRET_KEY = settings.APP_SECRET
ALGORITHM = "HS256"


async def get_token_header(x_token: Annotated[str, Header()]):
    if x_token != "hello":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def get_query_token(token: str):
    if token != "hello":
        raise HTTPException(
            status_code=400, detail="No token provided")


# def reduce_quality(fileObj: Image.Image, quality: int = 60) -> Dict[str, Any]:
#     image = Image.open(fileObj)
#     # in-memory bytes buffer
#     buffer = io.BytesIO()
#     image.save(buffer, format="JPEG", quality=60, optimize=True)
#     # move buffer cursor to beginning
#     buffer.seek(0)
#     # return Image.open(buffer)
#     return {'image': Image.open(buffer), 'size': len(buffer.getvalue())}


def get_role_from_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        if role is None:
            raise HTTPException(
                status_code=403, detail="Role missing in token")
        return role
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")


def get_email_from_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if email is None:
            raise HTTPException(
                status_code=403, detail="Role missing in token")
        return email
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")


def get_userID_from_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.lower().startswith("bearer"):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("userId")
        if not id:
            raise HTTPException(status_code=403, detail="ID missing in token")
        return UUID(id)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")


def get_my_profile(
    request: Request,
    session: Session = Depends(get_session)
):
    user_id = get_userID_from_token(request)
    statement = select(UserProfile).where(UserProfile.userdb_id == user_id)
    result = session.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="UserProfile not found")
    return result


def generate_handle(name: str) -> str:
    
    first_name = name.strip().split()[0].lower()
   
    random_digits = ''.join(random.choices(string.digits, k=4))
    return f"@{first_name}{random_digits}"
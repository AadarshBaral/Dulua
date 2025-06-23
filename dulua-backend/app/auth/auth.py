import random
from urllib import response

from sqlmodel import Field, Session, SQLModel, create_engine, select
from .models import PendingRegistration, UserCreate, UserDB, UserLogin, UserPublic, VerifyOtp
from datetime import datetime, timedelta, timezone
from os import access
import time
from ..lib.send_email import send_email
from fastapi import Body, FastAPI, Request, UploadFile, File, APIRouter, dependencies, Depends, HTTPException, middleware, status
import jwt
from pydantic import BaseModel, Field, EmailStr
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from app.session import get_session
from app.config import settings
router = APIRouter()
app = FastAPI()
SECRET_KEY = settings.APP_SECRET
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRATION_MINUTES = 30


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str, session: Session):
    user = session.exec(select(UserDB).where(
        UserDB.name == username)).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session=Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload.get("sub"))
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = session.exec(select(UserDB).where(
        UserDB.name == token_data.username)).first()
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[UserDB, Depends(get_current_user)],
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


# def get_user(db, username: str):
#     if username in db:
#         user_dict = db[username]
#         return UserInDB(**user_dict)


@router.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session=Depends(get_session)) -> Token:

    user = authenticate_user(
        form_data.username, form_data.password, session)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRATION_MINUTES)
    print(access_token_expires)
    print(user)
    access_token = create_access_token(
        data={"sub": user.name}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


# @router.get("/users/me")
# async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
#     return current_user

@router.get("/get-user")
async def read_users_me(
    current_user: Annotated[UserDB, Depends(get_current_active_user)],
):
    print(current_user)
    return {"username": current_user.name, "email": current_user.email}


@router.post("/register")
def register(user_in: UserCreate, session: Session = Depends(get_session)):

    statement_user = select(UserDB).where(UserDB.email == user_in.email)
    existing_user = session.exec(statement_user).first()

    statement_pending = select(PendingRegistration).where(
        PendingRegistration.email == user_in.email)
    existing_pending = session.exec(statement_pending).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    if existing_pending:
        session.delete(existing_pending)
        session.commit()

    hashed_password = get_password_hash(user_in.password)

    hashed_password = get_password_hash(user_in.password)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
    otp_code = str(random.randint(1000, 9999))

    pending = PendingRegistration(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_password,
        otp_code=otp_code,
        expires_at=expires_at
    )
    session.add(pending)
    session.commit()
    send_email(user_in.email, otp_code)
    return {"message": "Email sent"}


@router.post("/verify_otp")
def verify_otp(otp: VerifyOtp, session: Session = Depends(get_session)):
    pending = session.exec(
        select(PendingRegistration)
        .where(PendingRegistration.email == otp.email)
        .where(PendingRegistration.otp_code == otp.otp)
        .where(PendingRegistration.expires_at > datetime.now(timezone.utc))
    ).first()

    if not pending:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user = UserDB(
        name=pending.name,
        email=pending.email,
        hashed_password=pending.hashed_password,
        is_active=True
    )
    session.add(user)
    session.delete(pending)
    session.commit()
    session.refresh(user)

    return {"message": "OTP verified"}

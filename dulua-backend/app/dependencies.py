from fastapi import Header, HTTPException,Request
from typing_extensions import Annotated
from PIL import Image
from jose import JWTError, jwt

from .config import settings


SECRET_KEY=settings.APP_SECRET
ALGORITHM="HS256"

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
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        if role is None:
            raise HTTPException(status_code=403, detail="Role missing in token")
        return role
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")
    

def get_email_from_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if email is None:
            raise HTTPException(status_code=403, detail="Role missing in token")
        return email
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")
    
    
def get_userID_from_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("userId")
        if  not id:
            raise HTTPException(status_code=403, detail="ID missing in token")
        return id
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")
    
    
from fastapi import Header, HTTPException
from typing_extensions import Annotated
from PIL import Image
from typing import Dict, Any
import io


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

from fastapi import APIRouter, Depends
from ..dependencies import get_query_token
router = APIRouter()


@router.post("/")
async def update_admin():
    return {"message": "Aadarsh Baral is admin!!!iii"}

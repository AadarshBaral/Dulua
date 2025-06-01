from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["users"])
async def read_users():
    return [{"id": 1, "name": "John Doe"}]

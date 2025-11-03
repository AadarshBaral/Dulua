from .dependencies import role_required
from fastapi.staticfiles import StaticFiles
from app.session import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI
from .lib.tags import tags_metadata
from .auth import auth
from .core.trash_detection import router as detect_trash
from app.core.city import router as city_router
from app.core.place import router as place_router
from app.core.local_guide import router as local_guide_router
from app.core.userprofile import router as user_perofile_router
app = FastAPI(openapi_tags=tags_metadata)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.mount("/city/images/reviews",
          StaticFiles(directory="uploads/reviews"), name="review_images")
app.mount("/city/images/places",
          StaticFiles(directory="uploads/places"), name="places")
app.mount("/city/images/reviews",
          StaticFiles(directory="uploads/reviews"), name="review_images")
app.mount("/city/images/profiles",
          StaticFiles(directory="uploads/profile_images"), name="profile_images")
app.mount(
    "/uploads/profile_images",
    StaticFiles(directory="uploads/profile_images"),
    name="profile_images"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(detect_trash.router, prefix="/detect_trash")
app.include_router(city_router.router, prefix="/city", tags=["City"])
app.include_router(place_router.router, prefix="/place", tags=["Place"])
app.include_router(local_guide_router.router,
                   prefix="/local_guide", tags=["Local Guide"])
app.include_router(user_perofile_router.router,
                   prefix="/user", tags=["Userproile"])


@app.get("/")
async def root(role: str = Depends(role_required("admin"))):
    return {"message": "Hello Dulua"}

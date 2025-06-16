
from app.session import get_session, create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware
import time

from fastapi import Depends, FastAPI, Request, middleware
from .dependencies import get_token_header
from .routers import detect_trash, core
from .lib.tags import tags_metadata
from .auth import auth
app = FastAPI(openapi_tags=tags_metadata)

origins = [
    "http://localhost",
    "http://localhost:8080",
]


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(detect_trash.router, prefix='/detect_trash')
app.include_router(auth.router, prefix="/auth",
                   )
app.include_router(core.router, prefix="/city")


@app.get("/")
async def root():
    return {"message": "Hello Dulua"}

from fastapi import Depends, FastAPI
from .dependencies import get_token_header
from .internal import admin
from .routers import users
from .routers import detect_trash
from .lib.tags import tags_metadata

app = FastAPI(dependencies=[Depends(get_token_header)],
              openapi_tags=tags_metadata)


app.include_router(users.router, prefix='/users')
app.include_router(admin.router, prefix='/admin',
                   dependencies=[Depends(get_token_header)],
                   responses={401: {"description": "Unauthorized"}})
app.include_router(detect_trash.router, prefix='/detect_trash')


@app.get("/")
async def root():
    return {"message": "Hello Dulua"}

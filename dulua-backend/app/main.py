from fastapi import Depends, FastAPI
from .dependencies import get_token_header
from .internal import admin
from .routers import users

app = FastAPI(dependencies=[Depends(get_token_header)])


app.include_router(users.router, prefix='/users')
app.include_router(admin.router, prefix='/admin',
                   dependencies=[Depends(get_token_header)],
                   responses={401: {"description": "Unauthorized"}})


@app.get("/")
async def root():
    return {"message": "Hello Dulua"}

from pydantic import BaseModel
from typing import Optional


class UserProfileUpdate(BaseModel):

    image: Optional[str] = None

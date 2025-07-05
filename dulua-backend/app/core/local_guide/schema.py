
from uuid import UUID
from pydantic import BaseModel


class verifyRequest(BaseModel):
    id: UUID

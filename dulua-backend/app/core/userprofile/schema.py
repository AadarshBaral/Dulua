from pydantic import BaseModel
from uuid import UUID
class UpdateContributionRequest(BaseModel):
    user_profile_id: UUID
    contribution: int


class UpdateGreenPointsRequest(BaseModel):
    user_profile_id: UUID
    green_points: int
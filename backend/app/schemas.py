from pydantic import BaseModel
from datetime import datetime


class CrimeResponse(BaseModel):
    incident_id: int
    city: str
    incident_type: str
    occurred_at: datetime
    severity: int
    status: str


class HotspotResponse(BaseModel):
    area: str
    total_crimes: int

class DangerousHourResponse(BaseModel):
    hour: int
    total_crimes: int

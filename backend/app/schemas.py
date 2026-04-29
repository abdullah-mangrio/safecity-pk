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
    
    
from datetime import date, time
from typing import Optional


class PublicReportCreate(BaseModel):
    reporter_name: Optional[str] = None
    reporter_contact: Optional[str] = None

    city: str
    area: str
    crime_type: str
    severity: str

    description: str
    incident_date: date
    incident_time: Optional[time] = None


class PublicReportResponse(BaseModel):
    id: int
    status: str
    message: str

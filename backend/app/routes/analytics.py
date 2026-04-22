from fastapi import APIRouter
from app.schemas import HotspotResponse, DangerousHourResponse
from app.services.analytics_service import fetch_hotspots, fetch_dangerous_hours

router = APIRouter(prefix="/analytics")

@router.get("/hotspots", response_model=list[HotspotResponse])
def hotspot_areas():
    return fetch_hotspots()


@router.get("/dangerous-hours", response_model=list[DangerousHourResponse])
def dangerous_hours():
    return fetch_dangerous_hours()

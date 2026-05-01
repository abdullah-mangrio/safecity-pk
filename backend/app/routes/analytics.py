from fastapi import APIRouter, Depends

from app.core.security import require_roles
from app.schemas import HotspotResponse, DangerousHourResponse
from app.services.analytics_service import fetch_hotspots, fetch_dangerous_hours

router = APIRouter(prefix="/analytics")


@router.get("/hotspots", response_model=list[HotspotResponse])
def hotspot_areas(
    current_user: dict = Depends(require_roles(["admin", "analyst"]))
):
    return fetch_hotspots()


@router.get("/dangerous-hours", response_model=list[DangerousHourResponse])
def dangerous_hours(
    current_user: dict = Depends(require_roles(["admin", "analyst"]))
):
    return fetch_dangerous_hours()

from datetime import date

from fastapi import APIRouter, Depends

from app.core.security import require_roles
from app.db import get_connection
from app.schemas import CrimeResponse
from app.services.crime_service import fetch_crimes, get_crimes_for_map

router = APIRouter()


@router.get("/crimes", response_model=list[CrimeResponse])
def get_crimes(
    limit: int = 50,
    city: str | None = None,
    severity: int | None = None,
    status: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    current_user: dict = Depends(require_roles(["admin", "analyst"])),
):
    return fetch_crimes(
        limit=limit,
        city=city,
        severity=severity,
        status=status,
        date_from=date_from,
        date_to=date_to,
    )


@router.get("/crimes/map")
def crimes_map(city: int | None = None, severity: int | None = None):
    conn = get_connection()
    try:
        return get_crimes_for_map(conn, city=city, severity=severity)
    finally:
        conn.close()

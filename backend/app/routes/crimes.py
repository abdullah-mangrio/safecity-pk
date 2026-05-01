from datetime import date

from fastapi import APIRouter, Depends

from app.core.security import require_roles
from app.schemas import CrimeResponse
from app.services.crime_service import fetch_crimes

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

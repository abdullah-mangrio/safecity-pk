from fastapi import APIRouter, HTTPException, status
from psycopg2.extras import RealDictCursor

from app.db import get_connection
from app.schemas import PublicReportCreate, PublicReportResponse

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post(
    "/public",
    response_model=PublicReportResponse,
    status_code=status.HTTP_201_CREATED,
) 

def submit_public_report(payload: PublicReportCreate):
    conn = None

    try:
        conn = get_connection()

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                INSERT INTO public_reports (
                    reporter_name,
                    reporter_contact,
                    city,
                    area,
                    crime_type,
                    severity,
                    description,
                    incident_date,
                    incident_time,
                    status,
                    source
                )
                VALUES (
                    %(reporter_name)s,
                    %(reporter_contact)s,
                    %(city)s,
                    %(area)s,
                    %(crime_type)s,
                    %(severity)s,
                    %(description)s,
                    %(incident_date)s,
                    %(incident_time)s,
                    'pending',
                    'public'
                )
                RETURNING id, status;
                """,
                payload.model_dump(),
            )

            report = cur.fetchone()
            conn.commit()

        return {
            "id": report["id"],
            "status": report["status"],
            "message": "Report submitted successfully and is pending verification.",
        }

    except Exception as e:
        if conn:
            conn.rollback()

        print("REPORT SUBMISSION ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    finally:
        if conn:
            conn.close()

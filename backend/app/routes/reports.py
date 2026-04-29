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
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if conn:
            conn.close()


@router.get("/public")
def get_public_reports(status: str = "pending"):
    allowed_statuses = {"pending", "verified", "rejected"}

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Status must be one of: pending, verified, rejected.",
        )

    conn = None

    try:
        conn = get_connection()

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT
                    id,
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
                    source,
                    created_at
                FROM public_reports
                WHERE status = %s
                ORDER BY created_at DESC;
                """,
                (status,),
            )

            return cur.fetchall()

    except Exception as e:
        print("FETCH PUBLIC REPORTS ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if conn:
            conn.close()


@router.get("/public/pending")
def get_pending_public_reports():
    return get_public_reports(status="pending")


@router.patch("/public/{report_id}/status")
def update_public_report_status(report_id: int, new_status: str):
    allowed_statuses = {"verified", "rejected"}

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Status must be either 'verified' or 'rejected'.",
        )

    conn = None

    try:
        conn = get_connection()

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                UPDATE public_reports
                SET status = %s
                WHERE id = %s
                RETURNING id, status;
                """,
                (new_status, report_id),
            )

            updated_report = cur.fetchone()

            if not updated_report:
                raise HTTPException(status_code=404, detail="Report not found.")

            conn.commit()

        return {
            "id": updated_report["id"],
            "status": updated_report["status"],
            "message": f"Report {new_status} successfully.",
        }

    except HTTPException:
        if conn:
            conn.rollback()
        raise

    except Exception as e:
        if conn:
            conn.rollback()

        print("UPDATE REPORT STATUS ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if conn:
            conn.close()

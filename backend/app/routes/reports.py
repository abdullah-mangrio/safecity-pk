from fastapi import APIRouter, HTTPException, status, Depends
from psycopg2.extras import RealDictCursor, Json

from app.core.security import require_roles
from app.db import get_connection
from app.schemas import PublicReportCreate, PublicReportResponse

router = APIRouter(prefix="/reports", tags=["Reports"])


SEVERITY_TO_NUMBER = {
    "low": 2,
    "medium": 3,
    "high": 4,
    "critical": 5,
}


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
def get_public_reports(
    status: str = "pending",
    current_user: dict = Depends(require_roles(["admin"])),
):
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
def get_pending_public_reports(
    current_user: dict = Depends(require_roles(["admin"])),
):
    return get_public_reports(status="pending", current_user=current_user)


def get_or_create_city(cur, city_name: str):
    cur.execute(
        """
        SELECT city_id
        FROM city
        WHERE LOWER(name) = LOWER(%s);
        """,
        (city_name,),
    )
    city = cur.fetchone()

    if city:
        return city["city_id"]

    cur.execute(
        """
        INSERT INTO city (name, province)
        VALUES (%s, %s)
        RETURNING city_id;
        """,
        (city_name, "Unknown"),
    )

    return cur.fetchone()["city_id"]


def get_or_create_area(cur, city_id: int, area_name: str):
    cur.execute(
        """
        SELECT area_id
        FROM area
        WHERE city_id = %s
          AND LOWER(name) = LOWER(%s);
        """,
        (city_id, area_name),
    )
    area = cur.fetchone()

    if area:
        return area["area_id"]

    cur.execute(
        """
        INSERT INTO area (city_id, name)
        VALUES (%s, %s)
        RETURNING area_id;
        """,
        (city_id, area_name),
    )

    return cur.fetchone()["area_id"]


def get_or_create_incident_type(cur, crime_type: str):
    cur.execute(
        """
        SELECT incident_type_id
        FROM incident_type
        WHERE LOWER(name) = LOWER(%s);
        """,
        (crime_type,),
    )
    incident_type = cur.fetchone()

    if incident_type:
        return incident_type["incident_type_id"]

    cur.execute(
        """
        INSERT INTO incident_type (name, category)
        VALUES (%s, %s)
        RETURNING incident_type_id;
        """,
        (crime_type, "Public Report"),
    )

    return cur.fetchone()["incident_type_id"]


def public_report_already_promoted(cur, report_id: int):
    cur.execute(
        """
        SELECT incident_id
        FROM incident
        WHERE source = 'public'
          AND description LIKE %s
        LIMIT 1;
        """,
        (f"%Public Report ID: {report_id}%",),
    )

    return cur.fetchone()


def promote_public_report_to_incident(cur, report):
    existing_incident = public_report_already_promoted(cur, report["id"])

    if existing_incident:
        return existing_incident["incident_id"]

    city_id = get_or_create_city(cur, report["city"])
    area_id = get_or_create_area(cur, city_id, report["area"])
    incident_type_id = get_or_create_incident_type(cur, report["crime_type"])

    severity_number = SEVERITY_TO_NUMBER.get(report["severity"], 3)

    incident_time = report["incident_time"] or "00:00:00"
    occurred_at = f"{report['incident_date']} {incident_time}"

    title = report["crime_type"]
    description = (
        f"{report['description']}\n\n"
        f"Promoted from verified public report. "
        f"Public Report ID: {report['id']}"
    )

    cur.execute(
        """
        INSERT INTO incident (
            city_id,
            area_id,
            incident_type_id,
            occurred_at,
            severity,
            status,
            title,
            description,
            source,
            reported_by
        )
        VALUES (
            %s, %s, %s, %s,
            %s, 'verified',
            %s, %s,
            'public',
            NULL
        )
        RETURNING incident_id;
        """,
        (
            city_id,
            area_id,
            incident_type_id,
            occurred_at,
            severity_number,
            title,
            description,
        ),
    )

    return cur.fetchone()["incident_id"]


@router.patch("/public/{report_id}/status")
def update_public_report_status(
    report_id: int,
    new_status: str,
    current_user: dict = Depends(require_roles(["admin"])),
):
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
                SELECT
                    id,
                    city,
                    area,
                    crime_type,
                    severity,
                    description,
                    incident_date,
                    incident_time,
                    status
                FROM public_reports
                WHERE id = %s
                FOR UPDATE;
                """,
                (report_id,),
            )

            report = cur.fetchone()

            if not report:
                raise HTTPException(status_code=404, detail="Report not found.")

            promoted_incident_id = None

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

            if new_status == "verified":
                promoted_incident_id = promote_public_report_to_incident(cur, report)

            cur.execute(
                """
                INSERT INTO verification_log (
                    incident_id,
                    actor_user_id,
                    action,
                    notes,
                    old_values,
                    new_values
                )
                VALUES (%s, %s, %s, %s, %s, %s);
                """,
                (
                    promoted_incident_id,
                    current_user["user_id"],
                    "verify" if new_status == "verified" else "reject",
                    f"Public report {new_status} by admin.",
                    Json(
                        {
                            "public_report_id": report_id,
                            "old_status": report["status"],
                        }
                    ),
                    Json(
                        {
                            "public_report_id": report_id,
                            "new_status": new_status,
                            "promoted_incident_id": promoted_incident_id,
                        }
                    ),
                ),
            )

            conn.commit()

        return {
            "id": updated_report["id"],
            "status": updated_report["status"],
            "promoted_incident_id": promoted_incident_id,
            "message": (
                "Report verified and promoted to incident successfully."
                if new_status == "verified"
                else "Report rejected successfully."
            ),
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

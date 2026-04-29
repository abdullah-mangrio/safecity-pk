from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor

from app.db import get_connection

router = APIRouter(prefix="/admin", tags=["Admin Users"])


@router.get("/users")
def get_users():
    conn = None

    try:
        conn = get_connection()

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT
                    user_id,
                    full_name,
                    email,
                    role,
                    is_active,
                    created_at
                FROM app_user
                ORDER BY user_id ASC;
                """
            )

            return cur.fetchall()

    except Exception as e:
        print("FETCH USERS ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if conn:
            conn.close()


@router.patch("/users/{user_id}/deactivate")
def deactivate_user(user_id: int):
    conn = None

    try:
        conn = get_connection()

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                UPDATE app_user
                SET is_active = false
                WHERE user_id = %s
                RETURNING user_id, full_name, email, role, is_active;
                """,
                (user_id,),
            )

            user = cur.fetchone()

            if not user:
                raise HTTPException(status_code=404, detail="User not found.")

            conn.commit()

            return {
                "user_id": user["user_id"],
                "full_name": user["full_name"],
                "email": user["email"],
                "role": user["role"],
                "is_active": user["is_active"],
                "message": "User deactivated successfully.",
            }

    except HTTPException:
        if conn:
            conn.rollback()
        raise

    except Exception as e:
        if conn:
            conn.rollback()

        print("DEACTIVATE USER ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
def get_admin_stats():
    conn = None

    try:
        conn = get_connection()

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT
                    (SELECT COUNT(*) FROM app_user) AS total_users,
                    (SELECT COUNT(*) FROM app_user WHERE role IN ('security', 'operator')) AS security_officers,
                    (SELECT COUNT(*) FROM public_reports) AS total_reports,
                    (SELECT COUNT(*) FROM public_reports WHERE status = 'pending') AS pending_reports;
                """
            )

            return cur.fetchone()

    except Exception as e:
        print("FETCH ADMIN STATS ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if conn:
            conn.close()




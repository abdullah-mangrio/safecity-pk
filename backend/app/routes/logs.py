from fastapi import APIRouter, Depends
from psycopg2.extras import RealDictCursor
from app.db import get_connection
from app.core.security import require_roles

router = APIRouter(prefix="/admin/logs", tags=["Audit Logs"])


@router.get("/")
def get_logs(current_user: dict = Depends(require_roles(["admin"]))):
    conn = get_connection()

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT action, actor_user_id, notes, created_at
                FROM verification_log
                ORDER BY created_at DESC
                LIMIT 10;
            """)

            return cur.fetchall()

    finally:
        conn.close()

from app.db import get_connection


def fetch_hotspots():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT 
                a.name AS area,
                COUNT(i.incident_id) AS total_crimes
            FROM incident i
            JOIN area a ON i.area_id = a.area_id
            GROUP BY a.name
            ORDER BY total_crimes DESC
            LIMIT 10;
        """)

        rows = cur.fetchall()

        result = []
        for row in rows:
            result.append({
                "area": row[0],
                "total_crimes": row[1]
            })

        return result

    finally:
        cur.close()
        conn.close()


def fetch_dangerous_hours():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT 
                EXTRACT(HOUR FROM occurred_at)::int AS hour,
                COUNT(incident_id) AS total_crimes
            FROM incident
            GROUP BY hour
            ORDER BY total_crimes DESC, hour ASC
            LIMIT 24;
        """)

        rows = cur.fetchall()

        result = []
        for row in rows:
            result.append({
                "hour": row[0],
                "total_crimes": row[1]
            })

        return result

    finally:
        cur.close()
        conn.close()

from app.db import get_connection


def fetch_crimes(
    limit: int = 50,
    city: str | None = None,
    severity: int | None = None,
    status: str | None = None,
    date_from=None,
    date_to=None
):
    conn = get_connection()
    cur = conn.cursor()

    try:
        query = """
            SELECT 
                i.incident_id,
                c.name AS city,
                it.name AS incident_type,
                i.occurred_at,
                i.severity,
                i.status
            FROM incident i
            JOIN city c ON i.city_id = c.city_id
            JOIN incident_type it ON i.incident_type_id = it.incident_type_id
            WHERE 1=1
        """

        params = []

        if city:
            query += " AND c.name = %s"
            params.append(city)

        if severity is not None:
            query += " AND i.severity = %s"
            params.append(severity)

        if status:
            query += " AND i.status = %s"
            params.append(status)

        if date_from is not None:
            query += " AND DATE(i.occurred_at) >= %s"
            params.append(date_from)

        if date_to is not None:
            query += " AND DATE(i.occurred_at) <= %s"
            params.append(date_to)

        query += " ORDER BY i.occurred_at DESC LIMIT %s"
        params.append(limit)

        cur.execute(query, tuple(params))
        rows = cur.fetchall()

        return [
            {
                "incident_id": row[0],
                "city": row[1],
                "incident_type": row[2],
                "occurred_at": row[3],
                "severity": row[4],
                "status": row[5],
            }
            for row in rows
        ]

    finally:
        cur.close()
        conn.close()


def get_crimes_for_map(conn, city=None, severity=None):
    cur = conn.cursor()

    try:
        query = """
            SELECT 
                i.incident_id,
                i.latitude,
                i.longitude,
                i.severity,
                it.name AS crime_type
            FROM incident i
            JOIN incident_type it 
                ON i.incident_type_id = it.incident_type_id
            WHERE i.latitude IS NOT NULL
              AND i.longitude IS NOT NULL
        """

        params = []

        if city is not None:
            query += " AND i.city_id = %s"
            params.append(city)

        if severity is not None:
            query += " AND i.severity = %s"
            params.append(severity)

        query += " ORDER BY i.occurred_at DESC LIMIT 500"

        cur.execute(query, tuple(params))
        rows = cur.fetchall()

        return [
            {
                "id": row[0],
                "lat": float(row[1]),
                "lng": float(row[2]),
                "severity": row[3],
                "crime_type": row[4],
            }
            for row in rows
        ]

    finally:
        cur.close()

-- Daily incident counts with rolling 7-day average

WITH daily_incidents AS (
    SELECT
        DATE(occurred_at) AS incident_date,
        COUNT(*) AS total_incidents
    FROM incident
    GROUP BY DATE(occurred_at)
)

SELECT
    incident_date,
    total_incidents,
    ROUND(
        AVG(total_incidents) OVER (
            ORDER BY incident_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        )::numeric,
        2
    ) AS rolling_7day_avg
FROM daily_incidents
ORDER BY incident_date;

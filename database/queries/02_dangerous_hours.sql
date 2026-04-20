-- Most dangerous hours based on incident frequency

SELECT
    EXTRACT(HOUR FROM occurred_at) AS incident_hour,
    COUNT(*) AS total_incidents,
    ROUND(AVG(severity)::numeric, 2) AS avg_severity,
    RANK() OVER (
        ORDER BY COUNT(*) DESC, AVG(severity) DESC
    ) AS danger_rank
FROM incident
GROUP BY EXTRACT(HOUR FROM occurred_at)
ORDER BY danger_rank, incident_hour;

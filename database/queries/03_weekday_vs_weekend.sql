-- Weekday vs weekend incident analysis

SELECT
    CASE
        WHEN EXTRACT(ISODOW FROM occurred_at) IN (6, 7) THEN 'Weekend'
        ELSE 'Weekday'
    END AS day_type,
    COUNT(*) AS total_incidents,
    ROUND(AVG(severity)::numeric, 2) AS avg_severity
FROM incident
GROUP BY
    CASE
        WHEN EXTRACT(ISODOW FROM occurred_at) IN (6, 7) THEN 'Weekend'
        ELSE 'Weekday'
    END
ORDER BY day_type;

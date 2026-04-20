-- Top hotspot areas by incident count within each city

SELECT
    c.name AS city,
    a.name AS area,
    COUNT(i.incident_id) AS total_incidents,
    ROUND(AVG(i.severity)::numeric, 2) AS avg_severity,
    RANK() OVER (
        PARTITION BY c.city_id
        ORDER BY COUNT(i.incident_id) DESC, AVG(i.severity) DESC
    ) AS hotspot_rank
FROM incident i
JOIN city c ON i.city_id = c.city_id
JOIN area a ON i.area_id = a.area_id
GROUP BY c.city_id, c.name, a.area_id, a.name
ORDER BY c.name, hotspot_rank, a.name;

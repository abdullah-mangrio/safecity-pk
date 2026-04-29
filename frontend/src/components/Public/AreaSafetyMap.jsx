import { useEffect, useState } from "react"
import Badge from "../Common/Badge"
import { fetchHotspots } from "../../api/apiClient"
import "./AreaSafetyMap.css"

const markerPositions = [
  { top: "28%", left: "32%" },
  { top: "58%", left: "68%" },
  { top: "42%", left: "52%" },
  { top: "72%", left: "26%" },
  { top: "35%", left: "78%" },
  { top: "78%", left: "48%" },
]

function normalizeRiskLevel(spot) {
  return spot.riskLevel || spot.risk_level || "medium"
}

function normalizeIncidents(spot) {
  return spot.incidents || spot.count || spot.crime_count || 0
}

function AreaSafetyMap() {
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHotspots() {
      try {
        setLoading(true)
        const data = await fetchHotspots()

        const mappedData = data.map((spot, index) => ({
          ...spot,
          id: spot.id || index,
          area: spot.area || "Unknown Area",
          city: spot.city || "Unknown City",
          riskLevel: normalizeRiskLevel(spot),
          incidents: normalizeIncidents(spot),
          top: spot.top || markerPositions[index % markerPositions.length].top,
          left: spot.left || markerPositions[index % markerPositions.length].left,
        }))

        setHotspots(mappedData)
      } catch (error) {
        console.error("Failed to load public hotspots:", error)
        setHotspots([])
      } finally {
        setLoading(false)
      }
    }

    loadHotspots()
  }, [])

  return (
    <section className="map-card">
      <div className="map-card__header">
        <div>
          <h2>Area Safety Map</h2>
          <p>Public risk overview with live hotspot indicators</p>
        </div>

        <Badge variant="critical">Live Alerts</Badge>
      </div>

      <div className="city-map">
        <div className="map-road road-1"></div>
        <div className="map-road road-2"></div>
        <div className="map-road road-3"></div>

        {loading && <p className="map-loading">Loading hotspots...</p>}

        {!loading &&
          hotspots.map((spot) => (
            <div
              key={spot.id}
              className={`map-marker marker-${spot.riskLevel}`}
              style={{ top: spot.top, left: spot.left }}
              title={`${spot.area}, ${spot.city} - ${spot.riskLevel}`}
            >
              <span></span>

              <div className="marker-label">
                {spot.area}
                <small>
                  {spot.riskLevel} • {spot.incidents} cases
                </small>
              </div>
            </div>
          ))}
      </div>

      <div className="map-legend">
        <span>
          <i className="legend critical"></i> Critical
        </span>
        <span>
          <i className="legend high"></i> High
        </span>
        <span>
          <i className="legend medium"></i> Medium
        </span>
        <span>
          <i className="legend low"></i> Low
        </span>
      </div>
    </section>
  )
}

export default AreaSafetyMap

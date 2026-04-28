import { mockHotspots } from "../../data/mockData"
import Badge from "../Common/Badge"
import "./AreaSafetyMap.css"

function AreaSafetyMap() {
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

        {mockHotspots.map((spot) => (
          <div
            key={spot.id}
            className={`map-marker marker-${spot.riskLevel}`}
            style={{ top: spot.top, left: spot.left }}
            title={`${spot.area}, ${spot.city} - ${spot.riskLevel}`}
          >
            <span></span>
            <div className="marker-label">
              {spot.area}
              <small>{spot.riskLevel}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="map-legend">
        <span><i className="legend critical"></i> Critical</span>
        <span><i className="legend high"></i> High</span>
        <span><i className="legend medium"></i> Medium</span>
        <span><i className="legend low"></i> Low</span>
      </div>
    </section>
  )
}

export default AreaSafetyMap

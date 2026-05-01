import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

import Badge from "../Common/Badge"
import { fetchCrimeMap } from "../../api/apiClient"
import "./AreaSafetyMap.css"

const radarIcon = L.divIcon({
  className: "radar-marker",
  html: `<span class="radar-dot"></span>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

function AreaSafetyMap({ filters }) {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  const activeFilters = useMemo(() => {
    return filters || { city: "", severity: "" }
  }, [filters])

  useEffect(() => {
    async function loadMapData() {
      try {
        setLoading(true)
        const data = await fetchCrimeMap(activeFilters)
        setIncidents(data)
      } catch (error) {
        console.error("Map load error:", error)
        setIncidents([])
      } finally {
        setLoading(false)
      }
    }

    loadMapData()
  }, [activeFilters])

  return (
    <section className="map-card">
      <div className="map-card__header">
        <div>
          <h2>Crime Map</h2>
          <p>Live incidents based on selected filters</p>
        </div>

        <Badge variant="critical">Live Radar</Badge>
      </div>

      <div className="city-map real-leaflet-map">
        {loading && <p className="map-loading">Loading map...</p>}

        <MapContainer
          center={[30.3753, 69.3451]}
          zoom={5}
          scrollWheelZoom={false}
          className="leaflet-map"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {!loading &&
            incidents.map((incident) => {
              if (!incident.lat || !incident.lng) return null

              return (
                <Marker
                  key={incident.id}
                  position={[incident.lat, incident.lng]}
                  icon={radarIcon}
                >
                  <Popup>
                    <strong>{incident.crime_type}</strong>
                    <br />
                    Severity: {incident.severity}
                  </Popup>
                </Marker>
              )
            })}
        </MapContainer>
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

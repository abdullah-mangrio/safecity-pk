import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { fetchCrimeMap } from "../api/apiClient"
import "./LandingPage.css"

const radarIcon = L.divIcon({
  className: "radar-marker",
  html: `<span class="radar-dot"></span>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

function getSeverityLabel(severity) {
  if (severity >= 5) return "Critical"
  if (severity >= 4) return "High Alert"
  if (severity >= 3) return "Medium"
  return "Low"
}

function LandingPage({ onEnterCitizen, onEnterSecurity, onEnterAdmin }) {
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    async function loadLandingMap() {
      try {
        const data = await fetchCrimeMap()
        setIncidents(data.slice(0, 8))
      } catch (error) {
        console.error("Failed to load landing map:", error)
        setIncidents([])
      }
    }

    loadLandingMap()
  }, [])

  const topIncidents = incidents.slice(0, 3)

  return (
    <main className="landing">
      <nav className="landing-nav">
        <div className="brand">
          <span className="brand-icon">🛡️</span>
          <div>
            <h1>SafeCity PK</h1>
            <p>Crime Risk Intelligence System</p>
          </div>
        </div>

        <div className="nav-actions">
          <button onClick={onEnterCitizen}>Citizen Portal</button>
          <button onClick={onEnterSecurity}>Security Dashboard</button>
          <button className="admin-btn" onClick={onEnterAdmin}>Admin</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Public Safety • Analytics • Intelligence</p>
          <h2>Smarter Crime Monitoring for Safer Pakistani Cities</h2>
          <p className="hero-text">
            SafeCity PK helps citizens report incidents, view area safety levels,
            and enables security departments to analyze hotspots, verify reports,
            publish alerts, and make data-driven decisions.
          </p>

          <div className="hero-buttons">
            <button className="primary" onClick={onEnterCitizen}>
              Enter Citizen Portal
            </button>
            <button className="secondary" onClick={onEnterSecurity}>
              Open Security Dashboard
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span className="live-dot"></span>
            Live Risk Overview
          </div>

          <div className="risk-map-preview">
            <MapContainer
              center={[30.3753, 69.3451]}
              zoom={5}
              scrollWheelZoom={false}
              dragging={false}
              zoomControl={false}
              attributionControl={false}
              className="landing-leaflet-map"
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

              {incidents.map((incident) => (
                <Marker
                  key={incident.id}
                  position={[incident.lat, incident.lng]}
                  icon={radarIcon}
                >
                  <Popup>
                    <strong>{incident.crime_type}</strong>
                    <br />
                    Severity: {getSeverityLabel(incident.severity)}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="risk-list">
            {topIncidents.length === 0 ? (
              <div>
                <strong>No live incidents</strong>
                <span className="risk medium">Clear</span>
              </div>
            ) : (
              topIncidents.map((incident) => (
                <div key={incident.id}>
                  <strong>{incident.crime_type}</strong>
                  <span className="risk high">
                    {getSeverityLabel(incident.severity)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <h3>Citizen Reporting</h3>
          <p>Public users can report suspicious activity or incidents with location and details.</p>
        </div>

        <div className="feature-card">
          <h3>Hotspot Intelligence</h3>
          <p>Security teams can identify dangerous areas using analytics and risk scoring.</p>
        </div>

        <div className="feature-card">
          <h3>Safety Alerts</h3>
          <p>Police departments can issue public alerts and publish notices for citizens.</p>
        </div>

        <div className="feature-card">
          <h3>Admin Control</h3>
          <p>Admins approve security department users and manage platform-level access.</p>
        </div>
      </section>
    </main>
  )
}

export default LandingPage

import "./LandingPage.css"

function LandingPage({ onEnterCitizen, onEnterSecurity, onEnterAdmin }) {
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
            <span className="hotspot hotspot-1"></span>
            <span className="hotspot hotspot-2"></span>
            <span className="hotspot hotspot-3 medium"></span>
            <span className="hotspot hotspot-4 low"></span>
          </div>

          <div className="risk-list">
            <div>
              <strong>Karachi • Saddar</strong>
              <span className="risk high">High Alert</span>
            </div>
            <div>
              <strong>Peshawar • Hayatabad</strong>
              <span className="risk critical">Critical</span>
            </div>
            <div>
              <strong>Islamabad • F-7</strong>
              <span className="risk medium">Medium</span>
            </div>
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

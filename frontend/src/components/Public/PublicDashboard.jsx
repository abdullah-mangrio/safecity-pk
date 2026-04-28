import { mockAlerts, mockMyReports } from "../../data/mockData"
import AlertToast from "../Common/AlertToast"
import SafetyTipPopup from "../Common/SafetyTipPopup"
import Badge from "../Common/Badge"
import NoticeBoard from "../Common/NoticeBoard"
import AreaSafetyMap from "./AreaSafetyMap"
import "./PublicDashboard.css"

function PublicDashboard({ onBack }) {
  const latestAlert = mockAlerts[0]

  return (
    <main className="public-dashboard">
      <SafetyTipPopup />

      <header className="public-header">
        <div>
          <p className="eyebrow">Citizen Portal</p>
          <h1>Public Safety Center</h1>
          <p>
            Report incidents, monitor safety levels, and stay updated with official alerts.
          </p>
        </div>

        

        <button onClick={onBack}>Back to Home</button>
      </header>

      <section className="public-grid">
        <div className="public-main">
          <AreaSafetyMap />

          <section className="report-card">
            <div className="section-heading">
              <h2>My Reports</h2>
              <p>Track submitted incident reports</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockMyReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.trackingId}</td>
                    <td>{report.title}</td>
                    <td>{report.type}</td>
                    <td>
                      <Badge variant={report.status}>{report.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="public-side">
          <section className="alert-panel">
            <div className="section-heading">
              <h2>Safety Alerts</h2>
              <p>Latest official warnings</p>
            </div>

            {mockAlerts.map((alert) => (
              <article key={alert.id} className="alert-card">
                <Badge variant={alert.severity}>{alert.severity}</Badge>
                <h3>{alert.title}</h3>
                <p>{alert.message}</p>
                <small>{alert.issuedBy} • {alert.city}</small>
              </article>
            ))}
          </section>

          <NoticeBoard />
        </aside>
      </section>
    </main>
  )
}

export default PublicDashboard

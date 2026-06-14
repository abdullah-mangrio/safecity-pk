import { useEffect, useMemo, useState } from "react"
import { fetchCrimes, getReportsByStatus } from "../../api/apiClient"
import SafetyTipPopup from "../Common/SafetyTipPopup"
import Badge from "../Common/Badge"
import NoticeBoard from "../Common/NoticeBoard"
import AreaSafetyMap from "./AreaSafetyMap"
import ReportForm from "./ReportForm"
import "./PublicDashboard.css"

function getReportId(report) {
  return report.report_id || report.id
}

function PublicDashboard({ onBack }) {
  const [crimes, setCrimes] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadPublicDashboardData() {
    try {
      setLoading(true)

      const [crimesData, pendingReports, verifiedReports, rejectedReports] =
        await Promise.all([
          fetchCrimes(),
          getReportsByStatus("pending"),
          getReportsByStatus("verified"),
          getReportsByStatus("rejected"),
        ])

      const allReports = [
        ...pendingReports,
        ...verifiedReports,
        ...rejectedReports,
      ]

      const myReportIds = JSON.parse(
        localStorage.getItem("safecity_my_reports") || "[]"
      )

      const myReports = allReports.filter((report) =>
        myReportIds.includes(getReportId(report))
      )

      setCrimes(crimesData)
      setReports(myReports)
    } catch (error) {
      console.error("Failed to load public dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPublicDashboardData()
  }, [])

  const safetyAlerts = useMemo(() => {
    return crimes
      .filter(
        (crime) => crime.severity === "high" || crime.severity === "critical"
      )
      .slice(0, 4)
      .map((crime) => ({
        id: crime.id,
        severity: crime.severity,
        title: `${crime.type} reported in ${crime.area || "selected area"}`,
        message: `Citizens in ${crime.area || "this area"}, ${
          crime.city
        } are advised to stay alert and avoid unnecessary movement near the affected area.`,
        issuedBy: "SafeCity PK",
        city: crime.city,
      }))
  }, [crimes])

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

          <ReportForm onReportSubmitted={loadPublicDashboardData} />

          <section className="report-card">
            <div className="section-heading">
              <h2>My Reports</h2>
              <p>Track reports submitted from this browser</p>
            </div>

            {loading ? (
              <p>Loading reports...</p>
            ) : reports.length === 0 ? (
              <p>No reports submitted from this browser yet.</p>
            ) : (
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
                  {reports.map((report) => {
                    const reportId = getReportId(report)

                    return (
                      <tr key={`${reportId}-${report.status}`}>
                        <td>RPT-{String(reportId).padStart(4, "0")}</td>
                        <td>{report.title || "Untitled report"}</td>
                        <td>{report.incident_type || report.type || "N/A"}</td>
                        <td>
                          <Badge variant={report.status}>
                            {report.status}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <aside className="public-side">
          <section className="alert-panel">
            <div className="section-heading">
              <h2>Safety Alerts</h2>
              <p>Latest official warnings</p>
            </div>

            {loading ? (
              <p>Loading safety alerts...</p>
            ) : safetyAlerts.length === 0 ? (
              <p>No high-risk alerts at the moment.</p>
            ) : (
              safetyAlerts.map((alert) => (
                <article key={alert.id} className="alert-card">
                  <Badge variant={alert.severity}>{alert.severity}</Badge>
                  <h3>{alert.title}</h3>
                  <p>{alert.message}</p>
                  <small>
                    {alert.issuedBy} • {alert.city}
                  </small>
                </article>
              ))
            )}
          </section>

          <NoticeBoard />
        </aside>
      </section>
    </main>
  )
}

export default PublicDashboard

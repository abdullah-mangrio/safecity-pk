import { useMemo, useState } from "react"
import { mockCrimes, mockHotspots, mockPublicReports } from "../../data/mockData"
import StatCard from "../Common/StatCard"
import Badge from "../Common/Badge"
import CrimeFilters from "./CrimeFilters"
import HotspotTable from "./HotspotTable"
import "./SecurityDashboard.css"

function SecurityDashboard({ onBack }) {
  const [filters, setFilters] = useState({
    city: "",
    severity: "",
    status: "",
  })

  const filteredCrimes = useMemo(() => {
    return mockCrimes.filter((crime) => {
      const cityMatch = !filters.city || crime.city === filters.city
      const severityMatch = !filters.severity || crime.severity === filters.severity
      const statusMatch = !filters.status || crime.status === filters.status

      return cityMatch && severityMatch && statusMatch
    })
  }, [filters])

  const highSeverityCount = mockCrimes.filter(
    (crime) => crime.severity === "high" || crime.severity === "critical"
  ).length

  const openCases = mockCrimes.filter((crime) => crime.status === "open").length
  const verifiedReports = mockPublicReports.filter((report) => report.status === "verified").length

  return (
    <main className="security-dashboard">
      <header className="security-header">
        <div>
          <p className="eyebrow">Security Department</p>
          <h1>Crime Intelligence Dashboard</h1>
          <p>Operational analytics for hotspot monitoring and public report verification.</p>
        </div>

        <button onClick={onBack}>Back to Home</button>
      </header>

      <section className="security-stats">
        <StatCard icon="📊" label="Total Crimes" value={mockCrimes.length} subtext="Recorded incidents" color="blue" />
        <StatCard icon="🚨" label="High Severity" value={highSeverityCount} subtext="High + critical cases" color="red" />
        <StatCard icon="📂" label="Open Cases" value={openCases} subtext="Need attention" color="amber" />
        <StatCard icon="✅" label="Verified Reports" value={verifiedReports} subtext="Citizen reports verified" color="green" />
      </section>

      <section className="security-panel">
        <div className="section-heading">
          <h2>Crime Filters</h2>
          <p>Filter records by operational criteria</p>
        </div>
        <CrimeFilters filters={filters} onChange={setFilters} />
      </section>

      <section className="security-grid">
        <div className="security-main">
          <section className="crime-table-card">
            <div className="section-heading">
              <h2>Crime Records</h2>
              <p>Filtered incident records from database</p>
            </div>

            <table className="crime-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>City</th>
                  <th>Area</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrimes.map((crime) => (
                  <tr key={crime.id}>
                    <td>{crime.type}</td>
                    <td>{crime.city}</td>
                    <td>{crime.area}</td>
                    <td><Badge variant={crime.severity}>{crime.severity}</Badge></td>
                    <td><Badge variant={crime.status}>{crime.status}</Badge></td>
                    <td>{crime.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <HotspotTable hotspots={mockHotspots} />
        </div>

        <aside className="security-side">
          <section className="reports-panel">
            <div className="section-heading">
              <h2>Public Reports</h2>
              <p>Citizen submissions awaiting review</p>
            </div>

            {mockPublicReports.map((report) => (
              <article key={report.id} className="public-report-card">
                <div className="report-top">
                  <Badge variant={report.priority}>{report.priority}</Badge>
                  <Badge variant={report.status}>{report.status}</Badge>
                </div>

                <h3>{report.title}</h3>
                <p>{report.type} • {report.area}, {report.city}</p>

                <div className="report-actions">
                  <button className="verify-btn">Verify</button>
                  <button className="reject-btn">Reject</button>
                </div>
              </article>
            ))}
          </section>

          <section className="analytics-card">
            <h2>Analytics Summary</h2>
            <p>Peak risk window detected between evening and late night hours.</p>
            <div className="mini-bars">
              <span style={{ height: "35%" }}></span>
              <span style={{ height: "55%" }}></span>
              <span style={{ height: "45%" }}></span>
              <span style={{ height: "80%" }}></span>
              <span style={{ height: "65%" }}></span>
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default SecurityDashboard

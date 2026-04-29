import { useEffect, useState } from "react"
import { mockUsers, mockPlatformStats } from "../../data/mockData"
import { getPendingReports, updateReportStatus } from "../../api/apiClient"
import Badge from "../Common/Badge"
import StatCard from "../Common/StatCard"
import "./AdminDashboard.css"

function AdminDashboard({ onBack }) {
  const [pendingReports, setPendingReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [error, setError] = useState("")

  async function loadPendingReports() {
    try {
      setLoadingReports(true)
      setError("")

      const data = await getPendingReports()
      setPendingReports(data)
    } catch (err) {
      console.error("Failed to load pending reports:", err)
      setError("Failed to load pending reports.")
    } finally {
      setLoadingReports(false)
    }
  }

  async function handleReportAction(reportId, status) {
    try {
      setActionLoadingId(reportId)
      setError("")

      await updateReportStatus(reportId, status)

      setPendingReports((currentReports) =>
        currentReports.filter((report) => report.id !== reportId)
      )
    } catch (err) {
      console.error("Failed to update report status:", err)
      setError("Failed to update report status.")
    } finally {
      setActionLoadingId(null)
    }
  }

  useEffect(() => {
    loadPendingReports()
  }, [])

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="eyebrow">System Admin</p>
          <h1>Admin Control Panel</h1>
          <p>Manage users, approvals, public reports, and platform overview.</p>
        </div>

        <button onClick={onBack}>Back to Home</button>
      </header>

      <section className="admin-stats">
        <StatCard icon="👥" label="Total Users" value={mockPlatformStats.totalUsers} />
        <StatCard icon="🛡️" label="Security Officers" value={mockPlatformStats.securityOfficers} />
        <StatCard icon="⏳" label="Pending Reports" value={pendingReports.length} color="amber" />
        <StatCard icon="📊" label="Reports" value={mockPlatformStats.totalReports} />
      </section>

      {error && <div className="admin-error">{error}</div>}

      <section className="admin-grid">
        <section className="admin-card">
          <h2>Public Report Review</h2>

          {loadingReports ? (
            <p className="empty-state">Loading pending reports...</p>
          ) : pendingReports.length === 0 ? (
            <p className="empty-state">No pending public reports.</p>
          ) : (
            pendingReports.map((report) => (
              <div key={report.id} className="approval-card">
                <div>
                  <strong>
                    #{report.id} — {report.crime_type}
                  </strong>
                  <p>
                    {report.area}, {report.city}
                  </p>
                  <small>
                    Severity: {report.severity} • Date: {report.incident_date}
                  </small>
                  <p>{report.description}</p>
                </div>

                <div className="approval-actions">
                  <button
                    className="approve"
                    disabled={actionLoadingId === report.id}
                    onClick={() => handleReportAction(report.id, "verified")}
                  >
                    {actionLoadingId === report.id ? "Working..." : "Verify"}
                  </button>

                  <button
                    className="reject"
                    disabled={actionLoadingId === report.id}
                    onClick={() => handleReportAction(report.id, "rejected")}
                  >
                    {actionLoadingId === report.id ? "Working..." : "Reject"}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="admin-card">
          <h2>Users</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge variant={user.role}>{user.role}</Badge>
                  </td>
                  <td>
                    <Badge variant={user.status}>{user.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  )
}

export default AdminDashboard

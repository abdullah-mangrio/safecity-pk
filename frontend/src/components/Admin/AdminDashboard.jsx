import { useEffect, useState } from "react"
import {
  getPendingReports,
  updateReportStatus,
  getUsers,
  deactivateUser,
  getAdminStats,
} from "../../api/apiClient"

import Badge from "../Common/Badge"
import StatCard from "../Common/StatCard"
import "./AdminDashboard.css"

function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("pending")
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])

  const [stats, setStats] = useState({
    total_users: 0,
    security_officers: 0,
    total_reports: 0,
    pending_reports: 0,
  })

  const [loadingReports, setLoadingReports] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)

  const [reportActionId, setReportActionId] = useState(null)
  const [userActionId, setUserActionId] = useState(null)

  const [error, setError] = useState("")

  async function loadStats() {
    const data = await getAdminStats()
    setStats(data)
  }

  async function loadReports(status = "pending") {
    try {
      setLoadingReports(true)
      setError("")

      const data = await getPendingReports(status)
      setReports(data)
    } catch (err) {
      console.error("Failed to load reports:", err)
      setError("Failed to load reports.")
    } finally {
      setLoadingReports(false)
    }
  }

  async function loadUsers() {
    try {
      setLoadingUsers(true)
      setError("")

      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error("Failed to load users:", err)
      setError("Failed to load users.")
    } finally {
      setLoadingUsers(false)
    }
  }

  async function handleReportAction(reportId, status) {
    try {
      setReportActionId(reportId)
      setError("")

      await updateReportStatus(reportId, status)
      await loadReports(activeTab)
      await loadStats()
    } catch (err) {
      console.error("Failed to update report:", err)
      setError("Failed to update report status.")
    } finally {
      setReportActionId(null)
    }
  }

  async function handleDeactivateUser(userId) {
    try {
      setUserActionId(userId)
      setError("")

      await deactivateUser(userId)
      await loadUsers()
      await loadStats()
    } catch (err) {
      console.error("Failed to deactivate user:", err)
      setError("Failed to deactivate user.")
    } finally {
      setUserActionId(null)
    }
  }

  useEffect(() => {
    loadReports(activeTab)
  }, [activeTab])

  useEffect(() => {
    loadUsers()
    loadStats()
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
        <StatCard icon="👥" label="Total Users" value={stats.total_users} />

        <StatCard
          icon="🛡️"
          label="Security Officers"
          value={stats.security_officers}
        />

        <StatCard
          icon="⏳"
          label="Pending Reports"
          value={stats.pending_reports}
          color="amber"
        />

        <StatCard
          icon="📊"
          label="Reports"
          value={stats.total_reports}
        />
      </section>

      {error && <div className="admin-error">{error}</div>}

      <section className="admin-grid">
        <section className="admin-card">
          <h2>Public Report Review</h2>

          <div className="admin-tabs">
            <button
              className={activeTab === "pending" ? "active" : ""}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>

            <button
              className={activeTab === "verified" ? "active" : ""}
              onClick={() => setActiveTab("verified")}
            >
              Verified
            </button>

            <button
              className={activeTab === "rejected" ? "active" : ""}
              onClick={() => setActiveTab("rejected")}
            >
              Rejected
            </button>
          </div>

          {loadingReports ? (
            <p className="empty-state">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="empty-state">No {activeTab} reports.</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="approval-card">
                <div>
                  <strong>
                    #{report.id} — {report.crime_type}
                  </strong>

                  <p>
                    {report.area}, {report.city}
                  </p>

                  <small>
                    Severity: {report.severity} • Date: {report.incident_date} • Status:{" "}
                    {report.status}
                  </small>

                  <p>{report.description}</p>
                </div>

                {activeTab === "pending" && (
                  <div className="approval-actions">
                    <button
                      className="approve"
                      disabled={reportActionId === report.id}
                      onClick={() => handleReportAction(report.id, "verified")}
                    >
                      {reportActionId === report.id ? "Working..." : "Verify"}
                    </button>

                    <button
                      className="reject"
                      disabled={reportActionId === report.id}
                      onClick={() => handleReportAction(report.id, "rejected")}
                    >
                      {reportActionId === report.id ? "Working..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        <section className="admin-card">
          <h2>Users</h2>

          {loadingUsers ? (
            <p className="empty-state">Loading users...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>

                    <td>
                      <Badge variant={user.role}>{user.role}</Badge>
                    </td>

                    <td>
                      <Badge variant={user.is_active ? "active" : "inactive"}>
                        {user.is_active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </td>

                    <td>
                      {user.is_active ? (
                        <button
                          className="reject"
                          disabled={userActionId === user.user_id}
                          onClick={() => handleDeactivateUser(user.user_id)}
                        >
                          {userActionId === user.user_id ? "Working..." : "Deactivate"}
                        </button>
                      ) : (
                        <span className="empty-state">Deactivated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </section>
    </main>
  )
}

export default AdminDashboard

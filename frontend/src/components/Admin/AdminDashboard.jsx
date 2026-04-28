import { mockPendingDepartments, mockUsers, mockPlatformStats } from "../../data/mockData"
import Badge from "../Common/Badge"
import StatCard from "../Common/StatCard"
import "./AdminDashboard.css"

function AdminDashboard({ onBack }) {
  return (
    <main className="admin-dashboard">

      <header className="admin-header">
        <div>
          <p className="eyebrow">System Admin</p>
          <h1>Admin Control Panel</h1>
          <p>Manage users, approvals, and platform overview.</p>
        </div>

        <button onClick={onBack}>Back to Home</button>
      </header>

      <section className="admin-stats">
        <StatCard icon="👥" label="Total Users" value={mockPlatformStats.totalUsers} />
        <StatCard icon="🛡️" label="Security Officers" value={mockPlatformStats.securityOfficers} />
        <StatCard icon="⏳" label="Pending Approvals" value={mockPlatformStats.pendingApprovals} color="amber" />
        <StatCard icon="📊" label="Reports" value={mockPlatformStats.totalReports} />
      </section>

      <section className="admin-grid">

        {/* Pending Requests */}
        <section className="admin-card">
          <h2>Department Approval Requests</h2>

          {mockPendingDepartments.map((req) => (
            <div key={req.id} className="approval-card">
              <div>
                <strong>{req.officerName}</strong>
                <p>{req.department}</p>
                <small>{req.city}</small>
              </div>

              <div className="approval-actions">
                <button className="approve">Approve</button>
                <button className="reject">Reject</button>
              </div>
            </div>
          ))}
        </section>

        {/* Users */}
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
                  <td><Badge variant={user.role}>{user.role}</Badge></td>
                  <td><Badge variant={user.status}>{user.status}</Badge></td>
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

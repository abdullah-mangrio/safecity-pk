// ============================================================
// SafeCity PK API Client
// Handles backend requests + fallback to mock data
// ============================================================

import {
  mockCrimes,
  mockHotspots,
  mockPublicReports,
  mockAlerts,
  mockNotices,
  mockMyReports,
  mockPendingDepartments,
  mockUsers,
  mockPlatformStats,
} from "../data/mockData"

const API_BASE_URL = "http://127.0.0.1:8000"

// Generic fetch wrapper
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    })

    if (!res.ok) throw new Error("API error")

    return await res.json()
  } catch (err) {
    console.warn("API failed, using mock data")
    return null
  }
}

//
// 🔹 CRIMES + HOTSPOTS
//

export async function fetchCrimes(filters = {}) {
  const query = new URLSearchParams(filters).toString()
  const data = await apiFetch(`/crimes?${query}`)

  if (data) return data

  // fallback filtering
  let result = [...mockCrimes]

  if (filters.city) {
    result = result.filter((c) => c.city === filters.city)
  }

  if (filters.severity) {
    result = result.filter((c) => c.severity === filters.severity)
  }

  if (filters.status) {
    result = result.filter((c) => c.status === filters.status)
  }

  return result
}

export async function fetchHotspots() {
  const data = await apiFetch("/hotspots")
  return data || mockHotspots
}

//
// 🔹 REPORTS
//

export async function submitIncident(report) {
  const data = await apiFetch("/reports", {
    method: "POST",
    body: JSON.stringify(report),
  })

  return (
    data || {
      success: true,
      trackingId: `SC-${Math.floor(10000 + Math.random() * 90000)}`,
    }
  )
}

export async function fetchMyReports() {
  const data = await apiFetch("/reports/my")
  return data || mockMyReports
}

export async function fetchPublicReports() {
  const data = await apiFetch("/reports/public")
  return data || mockPublicReports
}

export async function verifyReport(id) {
  const data = await apiFetch(`/reports/${id}/verify`, {
    method: "PUT",
  })

  return data || { success: true }
}

export async function rejectReport(id) {
  const data = await apiFetch(`/reports/${id}/reject`, {
    method: "PUT",
  })

  return data || { success: true }
}

//
// 🔹 ALERTS
//

export async function fetchPublicAlerts() {
  const data = await apiFetch("/alerts")
  return data || mockAlerts
}

export async function createSafetyAlert(alert) {
  const data = await apiFetch("/alerts", {
    method: "POST",
    body: JSON.stringify(alert),
  })

  return data || { success: true }
}

//
// 🔹 NOTICES
//

export async function fetchNotices() {
  const data = await apiFetch("/notices")
  return data || mockNotices
}

export async function publishNotice(notice) {
  const data = await apiFetch("/notices", {
    method: "POST",
    body: JSON.stringify(notice),
  })

  return data || { success: true }
}

//
// 🔹 ADMIN
//

export async function fetchPendingDepartmentRequests() {
  const data = await apiFetch("/admin/requests")
  return data || mockPendingDepartments
}

export async function approveDepartmentUser(id) {
  const data = await apiFetch(`/admin/approve/${id}`, {
    method: "PUT",
  })

  return data || { success: true }
}

export async function fetchUsers() {
  const data = await apiFetch("/admin/users")
  return data || mockUsers
}

export async function fetchPlatformStats() {
  const data = await apiFetch("/admin/stats")
  return data || mockPlatformStats
}

//
// 🔹 AUTH (basic stub for now)
//

export async function loginUser({ email }) {
  // simple role detection (demo only)

  if (email.includes("admin")) {
    return { role: "admin", name: "Admin User" }
  }

  if (email.includes("police") || email.includes("gov")) {
    return { role: "security", name: "Security Officer" }
  }

  return { role: "citizen", name: "Citizen User" }
}

const BASE_URL = "http://127.0.0.1:8000"

function getToken() {
  return localStorage.getItem("safecity_token")
}

function authHeaders(extraHeaders = {}) {
  const token = getToken()

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: authHeaders(options.headers || {}),
  })

  const data = await response.json().catch(() => null)

  if (response.status === 401) {
    localStorage.removeItem("safecity_token")
    localStorage.removeItem("safecity_user")
    throw new Error("Unauthorized")
  }

  if (!response.ok) {
    throw new Error(data?.detail || "API request failed")
  }

  return data
}

function severityLabel(value) {
  if (value >= 5) return "critical"
  if (value >= 4) return "high"
  if (value >= 3) return "medium"
  return "low"
}

function riskLabel(totalCrimes) {
  if (totalCrimes >= 3) return "high"
  if (totalCrimes === 2) return "medium"
  return "low"
}

function severityValue(label) {
  const map = {
    low: 2,
    medium: 3,
    high: 4,
    critical: 5,
  }

  return map[label] || ""
}

const cityMap = {
  Karachi: 1,
  Lahore: 2,
  Islamabad: 3,
  Rawalpindi: 4,
  Peshawar: 5,
}

export async function loginUser(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  localStorage.setItem("safecity_token", data.access_token)
  localStorage.setItem("safecity_user", JSON.stringify(data.user))

  return data
}

export function logoutUser() {
  localStorage.removeItem("safecity_token")
  localStorage.removeItem("safecity_user")
}

export function getCurrentUser() {
  const user = localStorage.getItem("safecity_user")
  return user ? JSON.parse(user) : null
}

export async function fetchCrimes(params = {}) {
  try {
    const cleanParams = {}

    if (params.city) cleanParams.city = params.city
    if (params.status) cleanParams.status = params.status
    if (params.severity) cleanParams.severity = severityValue(params.severity)
    if (params.date_from) cleanParams.date_from = params.date_from
    if (params.date_to) cleanParams.date_to = params.date_to

    const query = new URLSearchParams(cleanParams).toString()
    const endpoint = query ? `/crimes?${query}` : "/crimes"

    const data = await apiRequest(endpoint)

    return data.map((crime) => ({
      id: crime.incident_id,
      type: crime.incident_type,
      city: crime.city,
      area: crime.area,
      severity: severityLabel(crime.severity),
      status: crime.status,
      date: crime.occurred_at?.slice(0, 10),
    }))
  } catch (error) {
    console.error("API ERROR fetchCrimes:", error)
    return []
  }
}

export async function fetchCrimeMap(params = {}) {
  const cleanParams = {}

  if (params.city) cleanParams.city = cityMap[params.city]
  if (params.severity) cleanParams.severity = severityValue(params.severity)

  const query = new URLSearchParams(cleanParams).toString()
  const endpoint = query ? `/crimes/map?${query}` : "/crimes/map"

  const response = await fetch(`${BASE_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error("Failed to fetch crime map data")
  }

  return response.json()
}

export async function fetchHotspots() {
  try {
    const data = await apiRequest("/analytics/hotspots")

    return data.map((spot, index) => ({
      id: index + 1,
      area: spot.area,
      city: "N/A",
      incidents: spot.total_crimes,
      riskLevel: riskLabel(spot.total_crimes),
      trend: "active",
    }))
  } catch (error) {
    console.error("API ERROR fetchHotspots:", error)
    return []
  }
}

export async function fetchDangerousHours() {
  try {
    return await apiRequest("/analytics/dangerous-hours")
  } catch (error) {
    console.error("API ERROR fetchDangerousHours:", error)
    return []
  }
}

export async function submitPublicReport(payload) {
  return await apiRequest("/reports/public", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
}

export async function getPendingReports(status = "pending") {
  try {
    return await apiRequest(`/reports/public?status=${status}`)
  } catch (error) {
    console.error("API ERROR getPendingReports:", error)
    return []
  }
}

export async function getReportsByStatus(status = "pending") {
  try {
    return await apiRequest(`/reports/public?status=${status}`)
  } catch (error) {
    console.error("API ERROR getReportsByStatus:", error)
    return []
  }
}

export async function updateReportStatus(id, status) {
  return await apiRequest(`/reports/public/${id}/status?new_status=${status}`, {
    method: "PATCH",
  })
}

export async function getUsers() {
  try {
    return await apiRequest("/admin/users")
  } catch (error) {
    console.error("API ERROR getUsers:", error)
    return []
  }
}

export async function deactivateUser(userId) {
  return await apiRequest(`/admin/users/${userId}/deactivate`, {
    method: "PATCH",
  })
}

export async function getAdminStats() {
  try {
    return await apiRequest("/admin/stats")
  } catch (error) {
    console.error("API ERROR getAdminStats:", error)

    return {
      total_users: 0,
      security_officers: 0,
      total_reports: 0,
      pending_reports: 0,
    }
  }
}

export async function getAuditLogs() {
  try {
    return await apiRequest("/admin/logs")
  } catch (error) {
    console.error("API ERROR getAuditLogs:", error)
    return []
  }
}

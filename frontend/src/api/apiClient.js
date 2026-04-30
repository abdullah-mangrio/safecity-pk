const BASE_URL = "http://127.0.0.1:8000"

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

async function apiRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options)

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.detail || "API request failed")
  }

  return data
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

export async function getPendingReports(status = "pending") {
  try {
    return await apiRequest(`/reports/public?status=${status}`)
  } catch (error) {
    console.error("API ERROR getPendingReports:", error)
    return []
  }
}

export async function updateReportStatus(id, status) {
  return await apiRequest(`/reports/public/${id}/status?new_status=${status}`, {
    method: "PATCH",
  })
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

export async function getReportsByStatus(status = "pending") {
  try {
    return await apiRequest(`/reports/public?status=${status}`)
  } catch (error) {
    console.error("API ERROR getReportsByStatus:", error)
    return []
  }
}


export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`);
  return res.json();
};

export const deactivateUser = async (userId) => {
  const res = await fetch(
    `${BASE_URL}/admin/users/${userId}/deactivate`,
    {
      method: "PATCH",
    }
  );
  return res.json();
};

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

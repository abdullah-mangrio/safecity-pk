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

export async function fetchCrimes(params = {}) {
  try {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${BASE_URL}/crimes?${query}`)

    if (!response.ok) {
      throw new Error("Failed to fetch crimes")
    }

    const data = await response.json()

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
    const response = await fetch(`${BASE_URL}/analytics/hotspots`)

    if (!response.ok) {
      throw new Error("Failed to fetch hotspots")
    }

    const data = await response.json()

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
    const response = await fetch(`${BASE_URL}/analytics/dangerous-hours`)

    if (!response.ok) {
      throw new Error("Failed to fetch dangerous hours")
    }

    return await response.json()
  } catch (error) {
    console.error("API ERROR fetchDangerousHours:", error)
    return []
  }
}

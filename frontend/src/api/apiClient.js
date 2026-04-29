const BASE_URL = "http://127.0.0.1:8000"

// --------------------
// GET ALL CRIMES
// --------------------
export async function fetchCrimes() {
  try {
    const response = await fetch(`${BASE_URL}/crimes`)

    if (!response.ok) {
      throw new Error("Failed to fetch crimes")
    }

    const data = await response.json()

    // Normalize backend → frontend format
    return data.map((item) => ({
      id: item.id,
      type: item.crime_type,
      city: item.city,
      area: item.area,
      severity: item.severity,
      status: item.status,
      date: item.reported_at,
    }))
  } catch (error) {
    console.error("API ERROR (fetchCrimes):", error)
    return []
  }
}

// --------------------
// GET HOTSPOTS
// --------------------
export async function fetchHotspots() {
  try {
    const response = await fetch(`${BASE_URL}/analytics/hotspots`)

    if (!response.ok) {
      throw new Error("Failed to fetch hotspots")
    }

    const data = await response.json()

    return data.map((item, index) => ({
      id: index,
      area: item.area,
      city: item.city,
      risk_level: item.risk_level,
      count: item.count,
    }))
  } catch (error) {
    console.error("API ERROR (fetchHotspots):", error)
    return []
  }
}

// --------------------
// GET DANGEROUS HOURS
// --------------------
export async function fetchDangerousHours() {
  try {
    const response = await fetch(`${BASE_URL}/analytics/dangerous-hours`)

    if (!response.ok) {
      throw new Error("Failed to fetch dangerous hours")
    }

    return await response.json()
  } catch (error) {
    console.error("API ERROR (dangerous-hours):", error)
    return []
  }
}

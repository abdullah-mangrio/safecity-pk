import { CITIES } from "../../data/mockData"
import "./CrimeFilters.css"

function CrimeFilters({ filters, onChange }) {
  function updateFilter(name, value) {
    onChange({
      ...filters,
      [name]: value,
    })
  }

  return (
    <section className="crime-filters">
      <div>
        <label>City</label>
        <select value={filters.city} onChange={(e) => updateFilter("city", e.target.value)}>
          <option value="">All Cities</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Severity</label>
        <select value={filters.severity} onChange={(e) => updateFilter("severity", e.target.value)}>
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        <label>Status</label>
        <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="under_investigation">Under Investigation</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
    </section>
  )
}

export default CrimeFilters

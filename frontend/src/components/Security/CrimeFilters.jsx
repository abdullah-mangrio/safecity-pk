import "./CrimeFilters.css"

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar"]

function CrimeFilters({ filters, onChange }) {
  function updateFilter(name, value) {
    onChange({
      ...filters,
      [name]: value,
    })
  }

  function resetFilters() {
    onChange({
      city: "",
      severity: "",
      status: "",
    })
  }

  return (
    <section className="crime-filters">
      <div className="filter-group">
        <label>City</label>
        <select
          value={filters.city}
          onChange={(e) => updateFilter("city", e.target.value)}
        >
          <option value="">All Cities</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Severity</label>
        <select
          value={filters.severity}
          onChange={(e) => updateFilter("severity", e.target.value)}
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="reported">Reported</option>
          <option value="under_review">Under Review</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Reset Button aligned with filters */}
      <div className="filter-reset">
        <button onClick={resetFilters}>Reset</button>
      </div>
    </section>
  )
}

export default CrimeFilters

import { useState } from "react"
import { submitPublicReport } from "../../api/apiClient"

const initialForm = {
  reporter_name: "",
  reporter_contact: "",
  city: "",
  area: "",
  crime_type: "",
  severity: "medium",
  description: "",
  incident_date: "",
  incident_time: "",
}

function getReportId(report) {
  return report.report_id || report.id
}

function saveReportToLocalStorage(report) {
  const reportId = getReportId(report)

  if (!reportId) return

  const savedReports = JSON.parse(
    localStorage.getItem("safecity_my_reports") || "[]"
  )

  if (!savedReports.includes(reportId)) {
    savedReports.push(reportId)
  }

  localStorage.setItem("safecity_my_reports", JSON.stringify(savedReports))
}

function ReportForm({ onReportSubmitted }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    if (!form.city.trim()) return "City is required."
    if (!form.area.trim()) return "Area is required."
    if (!form.crime_type.trim()) return "Crime type is required."
    if (!form.incident_date) return "Incident date is required."

    if (form.description.trim().length < 10) {
      return "Description must be at least 10 characters."
    }

    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setMessage("")
    setError("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    const payload = {
      reporter_name: form.reporter_name.trim() || null,
      reporter_contact: form.reporter_contact.trim() || null,
      city: form.city.trim(),
      area: form.area.trim(),
      crime_type: form.crime_type.trim(),
      severity: form.severity,
      description: form.description.trim(),
      incident_date: form.incident_date,
      incident_time: form.incident_time || null,
    }

    try {
      setLoading(true)

      const result = await submitPublicReport(payload)
      const reportId = getReportId(result)

      saveReportToLocalStorage(result)

      setMessage(
        `Report submitted successfully. Tracking ID: RPT-${String(
          reportId
        ).padStart(4, "0")}. Status: ${result.status || "pending"}.`
      )

      setForm(initialForm)

      if (onReportSubmitted) {
        await onReportSubmitted()
      }
    } catch (err) {
      console.error("Report submit failed:", err)
      setError(err.message || "Failed to submit report.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="public-card">
      <h2>Submit Incident Report</h2>
      <p className="muted">
        Submit a public safety report. It will be reviewed before verification.
      </p>

      {message && <div className="success-box">{message}</div>}
      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-row">
          <input
            name="reporter_name"
            value={form.reporter_name}
            onChange={handleChange}
            placeholder="Your name optional"
          />

          <input
            name="reporter_contact"
            value={form.reporter_contact}
            onChange={handleChange}
            placeholder="Contact optional"
          />
        </div>

        <div className="form-row">
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City e.g. Karachi"
            required
          />

          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="Area e.g. Gulshan"
            required
          />
        </div>

        <div className="form-row">
          <input
            name="crime_type"
            value={form.crime_type}
            onChange={handleChange}
            placeholder="Crime type e.g. Robbery"
            required
          />

          <select
            name="severity"
            value={form.severity}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-row">
          <input
            type="date"
            name="incident_date"
            value={form.incident_date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="incident_time"
            value={form.incident_time}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the incident..."
          rows="4"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </section>
  )
}

export default ReportForm

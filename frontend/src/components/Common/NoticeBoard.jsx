import { useEffect, useMemo, useState } from "react"
import { fetchCrimes } from "../../api/apiClient"
import "./NoticeBoard.css"

function NoticeBoard() {
  const [crimes, setCrimes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true)
        const crimesData = await fetchCrimes()
        setCrimes(crimesData)
      } catch (error) {
        console.error("Failed to load notice board data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNotices()
  }, [])

  const notices = useMemo(() => {
    const highRiskCrimes = crimes.filter(
      (crime) => crime.severity === "high" || crime.severity === "critical"
    )

    return highRiskCrimes.slice(0, 3).map((crime) => ({
      id: crime.id,
      category: crime.severity === "critical" ? "Critical Alert" : "Safety Notice",
      city: crime.city,
      title: `${crime.type} reported in ${crime.area || "selected area"}`,
      content: `Citizens are advised to remain cautious around ${
        crime.area || "the affected area"
      }. Follow official safety instructions and report suspicious activity immediately.`,
      postedBy: "SafeCity PK Security Desk",
      postedAt: crime.date || "Recent",
    }))
  }, [crimes])

  return (
    <section className="notice-board">
      <div className="section-heading">
        <h2>Public Notice Board</h2>
        <p>Official announcements from security departments</p>
      </div>

      <div className="notice-list">
        {loading ? (
          <p>Loading notices...</p>
        ) : notices.length === 0 ? (
          <p>No active public safety notices.</p>
        ) : (
          notices.map((notice) => (
            <article key={notice.id} className="notice-card">
              <div className="notice-meta">
                <span>{notice.category}</span>
                <small>{notice.city}</small>
              </div>

              <h3>{notice.title}</h3>
              <p>{notice.content}</p>

              <footer>
                {notice.postedBy} • {notice.postedAt}
              </footer>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default NoticeBoard

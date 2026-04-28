import "./StatCard.css"

function StatCard({ icon, label, value, subtext, color = "blue" }) {
  return (
    <article className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
        {subtext && <div className="stat-card__subtext">{subtext}</div>}
      </div>
    </article>
  )
}

export default StatCard

import Badge from "../Common/Badge"
import "./HotspotTable.css"

function HotspotTable({ hotspots }) {
  return (
    <section className="hotspot-table-card">
      <div className="section-heading">
        <h2>Crime Hotspots</h2>
        <p>Highest-risk areas by incident frequency</p>
      </div>

      <table className="hotspot-table">
        <thead>
          <tr>
            <th>Area</th>
            <th>City</th>
            <th>Incidents</th>
            <th>Risk</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {hotspots.map((spot) => (
            <tr key={spot.id}>
              <td>{spot.area}</td>
              <td>{spot.city}</td>
              <td>{spot.incidents}</td>
              <td><Badge variant={spot.riskLevel}>{spot.riskLevel}</Badge></td>
              <td>{spot.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default HotspotTable

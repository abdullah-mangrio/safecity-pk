import { mockNotices } from "../../data/mockData"
import "./NoticeBoard.css"

function NoticeBoard() {
  return (
    <section className="notice-board">
      <div className="section-heading">
        <h2>Public Notice Board</h2>
        <p>Official announcements from security departments</p>
      </div>

      <div className="notice-list">
        {mockNotices.map((notice) => (
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
        ))}
      </div>
    </section>
  )
}

export default NoticeBoard

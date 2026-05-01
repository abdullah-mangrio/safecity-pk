import { useState } from "react"
import "./LoginPage.css"

export default function LoginPage({ onLogin, loading = false, error = null }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [animating, setAnimating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (animating || loading) return
    if (!email.trim() || !password.trim()) return

    setAnimating(true)

    setTimeout(async () => {
      try {
        if (onLogin) {
          await onLogin(email, password)
        }
      } finally {
        setAnimating(false)
      }
    }, 1800)
  }

  return (
    <div className={`slc-root${animating ? " slc-animating" : ""}`}>
      <div className="slc-grid" />
      <div className="slc-scanlines" />

      <div className="slc-corner slc-corner--tl" />
      <div className="slc-corner slc-corner--tr" />
      <div className="slc-corner slc-corner--bl" />
      <div className="slc-corner slc-corner--br" />

      <div className="slc-panel">
        <div className={`slc-shield-wrap${animating ? " slc-shield-wrap--glow" : ""}`}>
          <div className="slc-shield-ring" />

          <div className={`slc-shield${animating ? " slc-shield--open" : ""}`}>
            <svg viewBox="0 0 80 90" className="slc-shield-svg">
              <path
                className="slc-gate-left"
                d="M40 4 L6 18 L6 48 Q6 72 40 84 Z"
                fill="rgba(0,255,247,0.08)"
                stroke="#00fff7"
                strokeWidth="1.5"
              />
              <path
                className="slc-gate-right"
                d="M40 4 L74 18 L74 48 Q74 72 40 84 Z"
                fill="rgba(0,112,255,0.08)"
                stroke="#00fff7"
                strokeWidth="1.5"
              />
              <circle cx="40" cy="44" r="14" fill="none" stroke="#00fff7" strokeWidth="1" opacity="0.6" />
              <text x="40" y="49" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#00fff7">
                PK
              </text>
            </svg>

            <div className={`slc-lock${animating ? " slc-lock--open" : ""}`}>
              <svg viewBox="0 0 24 28" width="22" height="26">
                <rect x="3" y="12" width="18" height="13" rx="2" fill="none" stroke="#00fff7" strokeWidth="1.5" />
                <path
                  className="slc-lock-shackle"
                  d="M8 12V8a4 4 0 1 1 8 0v4"
                  stroke="#00fff7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="12" cy="18.5" r="2" fill="#00fff7" opacity="0.8" />
              </svg>
            </div>
          </div>

          <div className={`slc-key${animating ? " slc-key--rise" : ""}`}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <circle cx="8" cy="8" r="5" stroke="#00fff7" strokeWidth="1.5" fill="none" />
              <circle cx="8" cy="8" r="2" fill="#00fff7" opacity="0.5" />
              <path d="M13 8 L22 8 L22 11 L20 11 L20 13 L18 13 L18 11 L13 11 Z" fill="#00fff7" opacity="0.8" />
            </svg>
          </div>

          <div className={`slc-glow-ring${animating ? " slc-glow-ring--pulse" : ""}`} />
        </div>

        <div className="slc-brand">
          <h1 className="slc-brand-title">SafeCity PK</h1>
          <p className="slc-brand-sub">Crime Hotspot Analyzer &amp; Risk Intelligence System</p>
        </div>

        <div className="slc-divider">
          <span className="slc-divider-line" />
          <span className="slc-divider-label">SECURE ACCESS</span>
          <span className="slc-divider-line" />
        </div>

        <form className="slc-form" onSubmit={handleSubmit}>
          <div className="slc-field-group">
            <label className="slc-label" htmlFor="sc-email">Operator Email</label>
            <div className="slc-input-wrap">
              <span className="slc-input-icon">✉</span>
              <input
                id="sc-email"
                className="slc-input"
                type="email"
                placeholder="admin@safecity.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={animating || loading}
                required
              />
            </div>
          </div>

          <div className="slc-field-group">
            <label className="slc-label" htmlFor="sc-password">Access Code</label>
            <div className="slc-input-wrap">
              <span className="slc-input-icon">🔒</span>
              <input
                id="sc-password"
                className="slc-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={animating || loading}
                required
              />
            </div>
          </div>

          {error && (
            <div className="slc-error">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className={`slc-btn${animating ? " slc-btn--animating" : ""}`}
            disabled={animating || loading}
          >
            {loading ? (
              <span className="slc-btn-spinner" />
            ) : animating ? (
              <span>Authenticating...</span>
            ) : (
              <span>Unlock System</span>
            )}
          </button>
        </form>

        <p className="slc-footer">
          <span className="slc-footer-dot" />
          Authorized personnel only — all access is logged
          <span className="slc-footer-dot" />
        </p>
      </div>

      <div className={`slc-transition-overlay${animating ? " slc-transition-overlay--active" : ""}`} />
    </div>
  )
}

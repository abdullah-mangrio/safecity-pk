import "./AlertToast.css"

function AlertToast({ alert }) {
  if (!alert) return null

  return (
    <div className={`alert-toast alert-${alert.severity}`}>
      <div className="alert-title">{alert.title}</div>
      <div className="alert-message">{alert.message}</div>
    </div>
  )
}

export default AlertToast

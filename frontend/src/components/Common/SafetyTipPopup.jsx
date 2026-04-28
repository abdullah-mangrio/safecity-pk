import { useEffect, useState } from "react"
import { SAFETY_TIPS } from "../../data/mockData"
import "./SafetyTipPopup.css"

function SafetyTipPopup() {
  const [tip, setTip] = useState(null)

  useEffect(() => {
    const showTip = () => {
      const random = SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)]
      setTip(random)

      setTimeout(() => {
        setTip(null)
      }, 5000)
    }

    showTip()
    const interval = setInterval(showTip, 15000)

    return () => clearInterval(interval)
  }, [])

  if (!tip) return null

  return (
    <div className="tip-popup">
      <strong>Safety Tip</strong>
      <p>{tip}</p>
    </div>
  )
}

export default SafetyTipPopup

import { useEffect, useState } from "react"
import "./SafetyTipPopup.css"

const SAFETY_TIPS = [
  "Avoid poorly lit areas at night and stay in populated zones.",
  "Immediately report suspicious activity through SafeCity PK.",
  "Do not share personal information with unknown individuals.",
  "Stay alert in crowded places and secure your belongings.",
  "In case of emergency, contact local authorities immediately.",
  "Avoid unnecessary travel during high-risk hours.",
  "Keep emergency contacts easily accessible.",
]

function SafetyTipPopup() {
  const [tip, setTip] = useState(null)

  useEffect(() => {
    const showTip = () => {
      const random =
        SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)]

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

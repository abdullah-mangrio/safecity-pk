import { useState } from "react"
import "./App.css"
import PublicDashboard from "./components/Public/PublicDashboard"
import SecurityDashboard from "./components/Security/SecurityDashboard"
import AdminDashboard from "./components/Admin/AdminDashboard"
///////////////////////
import LandingPage from "./pages/LandingPage"

function App() {
  // simple routing system
  const [page, setPage] = useState("landing")

  // role simulation
  const [role, setRole] = useState(null)

  return (
    <div className="app">
      
      {/* Routing */}
      {page === "landing" && (
        <LandingPage
          onEnterCitizen={() => {
            setRole("citizen")
            setPage("public")
          }}
          onEnterSecurity={() => {
            setRole("security")
            setPage("security")
          }}
          onEnterAdmin={() => {
            setRole("admin")
            setPage("admin")
          }}
        />
      )}

      {page === "public" && (
	<PublicDashboard onBack={() => setPage("landing")} />
      )}

      {page === "security" && (
  	<SecurityDashboard onBack={() => setPage("landing")} />
      )}

      {page === "admin" && (
        <AdminDashboard onBack={() => setPage("landing")} />
      )}

    </div>
  )
}

export default App

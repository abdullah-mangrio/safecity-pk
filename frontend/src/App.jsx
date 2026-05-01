import { useEffect, useState } from "react"
import "./App.css"

import PublicDashboard from "./components/Public/PublicDashboard"
import SecurityDashboard from "./components/Security/SecurityDashboard"
import AdminDashboard from "./components/Admin/AdminDashboard"
import LoginPage from "./components/Auth/LoginPage"
import LandingPage from "./pages/LandingPage"

import { getCurrentUser, loginUser, logoutUser } from "./api/apiClient"

function App() {
  const [page, setPage] = useState("landing")
  const [user, setUser] = useState(() => {
    try {
      return getCurrentUser()
    } catch {
      return null
    }
  })

  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    setPage("landing")
  }

  useEffect(() => {
    if (!user) return

    let timeout

    const resetTimer = () => {
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        // session expired (silent logout)
        handleLogout()
      }, 60000)
    }

    const events = ["mousemove", "keydown", "click", "scroll"]

    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    resetTimer()

    return () => {
      clearTimeout(timeout)

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [user])

  const handleLogin = async (email, password) => {
    try {
      setLoginLoading(true)
      setLoginError("")

      const data = await loginUser(email, password)
      setUser(data.user)

      if (data.user.role === "admin") {
        setPage("admin")
      } else if (data.user.role === "analyst") {
        setPage("security")
      } else {
        setPage("public")
      }
    } catch (error) {
      setLoginError(error.message || "Login failed")
    } finally {
      setLoginLoading(false)
    }
  }

  const goToLogin = () => {
    setLoginError("")
    setPage("login")
  }

  return (
    <div className="app">
      {page === "landing" && (
        <LandingPage
          onEnterCitizen={() => {
            setPage("public")
          }}
          onEnterSecurity={() => {
            if (user?.role === "admin" || user?.role === "analyst") {
              setPage("security")
            } else {
              goToLogin()
            }
          }}
          onEnterAdmin={() => {
            if (user?.role === "admin") {
              setPage("admin")
            } else {
              goToLogin()
            }
          }}
        />
      )}

      {page === "login" && (
        <LoginPage
          onLogin={handleLogin}
          loading={loginLoading}
          error={loginError}
        />
      )}

      {page === "public" && (
        <PublicDashboard onBack={() => setPage("landing")} />
      )}

      {page === "security" && (
        <SecurityDashboard
          onBack={() => setPage("landing")}
          onLogout={handleLogout}
        />
      )}

      {page === "admin" && (
        <AdminDashboard
          onBack={() => setPage("landing")}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App

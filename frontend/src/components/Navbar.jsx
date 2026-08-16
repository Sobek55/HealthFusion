import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../services/api'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await getCurrentUser()
        setIsLoggedIn(true)
      } catch {
        setIsLoggedIn(false)
      }
    }

    checkAuthentication()
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await logoutUser()
      setIsLoggedIn(false)
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Health<span>Fusion</span>
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/discover">Discover</Link>

        {isLoggedIn ? (
          <>
            <Link to="/meals">Meal Tracking</Link>
            <Link to="/dashboard">User Progress</Link>
            <Link to="/profile">User Profile</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      {isLoggedIn ? (
        <button
          className="login-button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      ) : (
        <Link to="/login" className="login-button">
          Log In
        </Link>
      )}
    </header>
  )
}

export default Navbar

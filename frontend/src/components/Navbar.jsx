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
  }, [location])

  const handleLogout = async () => {
    try {
      await logoutUser()
      setIsLoggedIn(false)
      navigate('/login')
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
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/meals">Meals</Link>
        <Link to="/goals">Goals</Link>
        <Link to="/profile">Profile</Link>
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
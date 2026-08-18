import { useEffect, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'

import {
  getCurrentUser,
  logoutUser
} from '../services/api'

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

  const navClass = (path) =>
    location.pathname === path
      ? 'nav-link active'
      : 'nav-link'

  return (
    <header className="navbar">
      <Link
        to="/"
        className="logo"
        aria-label="HealthFusion home"
      >
        Health<span>Fusion</span>
      </Link>

      <nav aria-label="Primary navigation">
        <Link
          to="/"
          className={navClass('/')}
          aria-current={
            location.pathname === '/'
              ? 'page'
              : undefined
          }
        >
          Home
        </Link>

        <Link
          to="/discover"
          className={navClass('/discover')}
          aria-current={
            location.pathname === '/discover'
              ? 'page'
              : undefined
          }
        >
          Discover
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/meals"
              className={navClass('/meals')}
              aria-current={
                location.pathname === '/meals'
                  ? 'page'
                  : undefined
              }
            >
              Meal Tracking
            </Link>

            <Link
              to="/dashboard"
              className={navClass('/dashboard')}
              aria-current={
                location.pathname === '/dashboard'
                  ? 'page'
                  : undefined
              }
            >
              User Progress
            </Link>

            <Link
              to="/profile"
              className={navClass('/profile')}
              aria-current={
                location.pathname === '/profile'
                  ? 'page'
                  : undefined
              }
            >
              User Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={navClass('/login')}
              aria-current={
                location.pathname === '/login'
                  ? 'page'
                  : undefined
              }
            >
              Login
            </Link>

            <Link
              to="/register"
              className={navClass('/register')}
              aria-current={
                location.pathname === '/register'
                  ? 'page'
                  : undefined
              }
            >
              Register
            </Link>
          </>
        )}
      </nav>

      {isLoggedIn && (
        <button
          type="button"
          className="login-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </header>
  )
}

export default Navbar

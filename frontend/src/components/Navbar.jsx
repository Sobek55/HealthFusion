import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  // useLocation makes the component update when the route changes
  // so we can re-check whether a token exists after login
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  const handleLogout = () => {
    localStorage.removeItem('token')

    navigate('/login', {
      replace: true
    })
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Health<span>Fusion</span>
      </Link>

      <nav>
        <Link to="/">Home</Link>

        {isLoggedIn && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/meals">Meals</Link>
            <Link to="/goals">Goals</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </nav>

      {isLoggedIn ? (
        <button
          type="button"
          className="logout-button"
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
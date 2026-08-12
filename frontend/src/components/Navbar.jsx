import { Link } from 'react-router-dom'

function Navbar() {
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

      <Link to="/login" className="login-button">
        Log In
      </Link>
    </header>
  )
}

export default Navbar
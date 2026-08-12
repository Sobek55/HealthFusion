import { Link } from 'react-router-dom'

function Login() {
  return (
    <main className="page-container">
      <h1>Log In</h1>

      <p>HealthFusion login will go here.</p>

      <p>
        Don't have an account? <Link to="/register">Create Account</Link>
      </p>
    </main>
  )
}

export default Login
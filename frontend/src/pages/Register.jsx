import { Link } from 'react-router-dom'

function Register() {
  return (
    <main className="page-container">
      <h1>Create Account</h1>

      <p>HealthFusion registration will go here.</p>

      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </main>
  )
}

export default Register
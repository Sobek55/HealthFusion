import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  loginUser,
  getPasswordHint
} from '../services/api'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [hintMessage, setHintMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))

    if (error) {
      setError('')
    }

    if (hintMessage) {
      setHintMessage('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      setLoading(true)

      await loginUser({
        email: formData.email,
        password: formData.password
      })

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordHint = async () => {
    setError('')
    setHintMessage('')

    if (!formData.email.trim()) {
      setError('Enter your email first to view your password hint')
      return
    }

    try {
      setHintLoading(true)
      const data = await getPasswordHint(formData.email)

      setHintMessage(
        data.hint
          ? `Password hint: ${data.hint}`
          : data.message
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setHintLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="tagline">WELCOME BACK</p>
          <h1>Log in to HealthFusion</h1>
          <p>
            Continue tracking your nutrition, meals, and progress toward your goals.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {hintMessage && (
            <p className="auth-success" role="status">
              {hintMessage}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          <button
            type="button"
            className="link-button"
            onClick={handlePasswordHint}
            disabled={hintLoading}
          >
            {hintLoading ? 'Loading Hint...' : 'View Password Hint'}
          </button>
          {' | '}
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create Account</Link>
        </p>
      </div>
    </main>
  )
}

export default Login

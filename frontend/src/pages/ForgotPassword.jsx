import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestPasswordReset } from '../services/api'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    // Sanitize and validate email
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Email cannot be empty')
      return
    }

    try {
      setLoading(true)

      const data = await requestPasswordReset(trimmedEmail)
      setMessage(data.message)

      if (data.resetToken) {
        navigate(
          `/reset-password?token=${encodeURIComponent(data.resetToken)}`
        )
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="tagline">PASSWORD RECOVERY</p>
          <h1>Forgot your password?</h1>
          <p>
            Enter the email address for your HealthFusion account.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="forgotEmail">Email</label>
            <input
              type="email"
              id="forgotEmail"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="profile-success" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Reset Link...' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-switch">
          Remembered your password?{' '}
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </main>
  )
}

export default ForgotPassword

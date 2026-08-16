import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/api'

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        const data = await getCurrentUser(token)
        setUser(data.user)
      } catch (error) {
        console.error('Unable to load user:', error)

        localStorage.removeItem('token')
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [navigate])

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading dashboard...</p>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="page-container">
      <h1>Welcome, {user.first_name}!</h1>

      <p>
        Here is your HealthFusion dashboard.
      </p>

      <div className="dashboard-user-card">
        <h3>Your Account</h3>

        <p>
          <strong>Name:</strong>{' '}
          {user.first_name} {user.last_name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </main>
  )
}

export default Dashboard
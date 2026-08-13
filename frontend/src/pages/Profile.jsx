import { useEffect, useState } from 'react'
import { getProfile, saveProfile } from '../services/api'

function Profile() {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    activityLevel: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile()

        if (data.profile) {
          setFormData({
            age: data.profile.age || '',
            height: data.profile.height || '',
            weight: data.profile.weight || '',
            activityLevel: data.profile.activity_level || ''
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')
    setSaving(true)

    try {
      const data = await saveProfile(formData)

      setMessage(data.message || 'Profile saved successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading profile...</p>
      </main>
    )
  }

  return (
    <main className="page-container">
      <div className="profile-card">

        <div className="profile-header">
          <h1>Your Profile</h1>

          <p>
            Keep your information up to date so HealthFusion can personalize
            your nutrition experience.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="age">Age</label>

            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              placeholder="Enter your age"
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">Height</label>

            <input
              type="number"
              step="0.01"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="0"
              placeholder="Enter your height"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight</label>

            <input
              type="number"
              step="0.01"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0"
              placeholder="Enter your weight"
            />
          </div>

          <div className="form-group">
            <label htmlFor="activityLevel">
              Activity Level
            </label>

            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
            >
              <option value="">
                Select activity level
              </option>

              <option value="Sedentary">
                Sedentary
              </option>

              <option value="Lightly Active">
                Lightly Active
              </option>

              <option value="Moderately Active">
                Moderately Active
              </option>

              <option value="Very Active">
                Very Active
              </option>

              <option value="Extremely Active">
                Extremely Active
              </option>
            </select>
          </div>

          {message && (
            <p className="profile-success">
              {message}
            </p>
          )}

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Profile'}
          </button>

        </form>
      </div>
    </main>
  )
}

export default Profile
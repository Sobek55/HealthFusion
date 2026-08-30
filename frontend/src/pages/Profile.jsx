import { useEffect, useState } from 'react'
import {
  getProfile,
  saveProfile,
  getNutritionGoals
} from '../services/api'

function Profile() {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    targetWeight: '',
    healthGoal: '',
    activityLevel: '',
    dietaryPreferences: '',
    foodRestrictions: ''
  })

  const [goals, setGoals] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileData, goalData] = await Promise.all([
          getProfile(),
          getNutritionGoals()
        ])

        if (profileData.profile) {
          const profile = profileData.profile

          setFormData({
            age: profile.age ?? '',
            height: profile.height ?? '',
            weight: profile.weight ?? '',
            targetWeight: profile.target_weight ?? '',
            healthGoal: profile.health_goal ?? '',
            activityLevel: profile.activity_level ?? '',
            dietaryPreferences: profile.dietary_preferences ?? '',
            foodRestrictions: profile.food_restrictions ?? ''
          })
        }

        setGoals(goalData.goals || null)
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

    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    // Validation checks
    const age = parseInt(formData.age, 10)
    const height = parseFloat(formData.height)
    const weight = parseFloat(formData.weight)
    const targetWeight = parseFloat(formData.targetWeight)

    if (formData.age && (isNaN(age) || age < 1 || age > 120)) {
      setError('Age must be between 1 and 120')
      return
    }

    if (formData.height && (isNaN(height) || height <= 0)) {
      setError('Height must be a positive number')
      return
    }

    if (formData.weight && (isNaN(weight) || weight <= 0)) {
      setError('Current weight must be a positive number')
      return
    }

    if (formData.targetWeight && (isNaN(targetWeight) || targetWeight <= 0)) {
      setError('Target weight must be a positive number')
      return
    }

    setSaving(true)

    try {
      const data = await saveProfile(formData)

      setMessage(
        data.message || 'Profile saved successfully'
      )

      if (data.goals) {
        setGoals(data.goals)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="page-container profile-page">
        <div
          className="app-loader"
          role="status"
          aria-live="polite"
        >
          <span
            className="app-loader-spinner"
            aria-hidden="true"
          />

          <div>
            <strong>Loading your profile</strong>
            <p>
              Preparing your health and nutrition settings...
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-container profile-page">
      <div className="profile-card">

        <div className="profile-header">
          <p className="tagline">USER PROFILE</p>

          <h1>Your Profile</h1>

          <p>
            Keep your information up to date so HealthFusion
            can personalize your nutrition targets.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="healthGoal">
              Health Goal
            </label>

            <select
              id="healthGoal"
              name="healthGoal"
              value={formData.healthGoal}
              onChange={handleChange}
            >
              <option value="">
                Select a health goal
              </option>

              <option value="Weight Loss">
                Weight Loss
              </option>

              <option value="Muscle Gain">
                Muscle Gain
              </option>

              <option value="Weight Maintenance">
                Weight Maintenance
              </option>

              <option value="Improved Nutrition">
                Improved Nutrition
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="age">
              Age
            </label>

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
            <label htmlFor="height">
              Height (in)
            </label>

            <input
              type="number"
              step="0.01"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="0.01"
              placeholder="Example: 70"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">
              Current Weight (lb)
            </label>

            <input
              type="number"
              step="0.1"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0.1"
              placeholder="Current weight"
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetWeight">
              Target Weight (lb)
            </label>

            <input
              type="number"
              step="0.1"
              id="targetWeight"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleChange}
              min="0.1"
              placeholder="Target weight"
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

              <option value="Highly Active">
                Highly Active
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dietaryPreferences">
              Dietary Preferences
            </label>

            <textarea
              id="dietaryPreferences"
              name="dietaryPreferences"
              rows="3"
              value={formData.dietaryPreferences}
              onChange={handleChange}
              placeholder="Example: High protein"
            />
          </div>

          <div className="form-group">
            <label htmlFor="foodRestrictions">
              Food Restrictions
            </label>

            <textarea
              id="foodRestrictions"
              name="foodRestrictions"
              rows="3"
              value={formData.foodRestrictions}
              onChange={handleChange}
              placeholder="Example: No shellfish, or None"
            />
          </div>

          {message && (
            <p
              className="profile-success"
              role="status"
            >
              {message}
            </p>
          )}

          {error && (
            <p
              className="auth-error"
              role="alert"
            >
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

        {goals && (
          <section className="profile-targets">
            <p className="tagline">
              RECOMMENDED TARGETS
            </p>

            <h2>
              Current Nutrition Targets
            </h2>

            <p>
              Saving a new health goal, activity level,
              or current weight automatically updates
              these targets.
            </p>

            <div className="preview-summary-grid">

              <div className="preview-stat">
                <span>Calories</span>
                <strong>
                  {Number(
                    goals.calorie_goal
                  ).toFixed(0)}
                </strong>
                <small>kcal</small>
              </div>

              <div className="preview-stat">
                <span>Protein</span>
                <strong>
                  {Number(
                    goals.protein_goal
                  ).toFixed(1)}
                </strong>
                <small>grams</small>
              </div>

              <div className="preview-stat">
                <span>Carbs</span>
                <strong>
                  {Number(
                    goals.carb_goal
                  ).toFixed(1)}
                </strong>
                <small>grams</small>
              </div>

              <div className="preview-stat">
                <span>Fat</span>
                <strong>
                  {Number(
                    goals.fat_goal
                  ).toFixed(1)}
                </strong>
                <small>grams</small>
              </div>

            </div>
          </section>
        )}

      </div>
    </main>
  )
}

export default Profile

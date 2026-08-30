import { useEffect, useState } from 'react'

import {
  getNutritionGoals,
  saveNutritionGoals
} from '../services/api'

function Goals() {
  const [formData, setFormData] = useState({
    calorieGoal: '',
    proteinGoal: '',
    carbGoal: '',
    fatGoal: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await getNutritionGoals()

        if (data.goals) {
          setFormData({
            calorieGoal: data.goals.calorie_goal || '',
            proteinGoal: data.goals.protein_goal || '',
            carbGoal: data.goals.carb_goal || '',
            fatGoal: data.goals.fat_goal || ''
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadGoals()
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
    const calories = parseFloat(formData.calorieGoal)
    const protein = parseFloat(formData.proteinGoal)
    const carbs = parseFloat(formData.carbGoal)
    const fat = parseFloat(formData.fatGoal)

    if (isNaN(calories) || calories <= 0) {
      setError('Calories must be greater than 0')
      return
    }

    if (isNaN(protein) || protein < 0) {
      setError('Protein cannot be negative')
      return
    }

    if (isNaN(carbs) || carbs < 0) {
      setError('Carbohydrates cannot be negative')
      return
    }

    if (isNaN(fat) || fat < 0) {
      setError('Fat cannot be negative')
      return
    }

    setSaving(true)

    try {
      const data = await saveNutritionGoals(formData)

      setMessage(
        data.message ||
        'Nutrition goals saved successfully'
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading nutrition goals...</p>
      </main>
    )
  }

  return (
    <main className="page-container">
      <div className="goals-card">

        <div className="profile-header">
          <h1>Nutrition Goals</h1>

          <p>
            Set your daily calorie and macronutrient targets.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="calorieGoal">
              Daily Calories
            </label>

            <input
              type="number"
              id="calorieGoal"
              name="calorieGoal"
              value={formData.calorieGoal}
              onChange={handleChange}
              min="1"
              placeholder="Example: 2200"
              required
            />
          </div>

          <div className="goals-grid">

            <div className="form-group">
              <label htmlFor="proteinGoal">
                Protein (g)
              </label>

              <input
                type="number"
                step="0.01"
                id="proteinGoal"
                name="proteinGoal"
                value={formData.proteinGoal}
                onChange={handleChange}
                min="0"
                placeholder="180"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="carbGoal">
                Carbs (g)
              </label>

              <input
                type="number"
                step="0.01"
                id="carbGoal"
                name="carbGoal"
                value={formData.carbGoal}
                onChange={handleChange}
                min="0"
                placeholder="200"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fatGoal">
                Fat (g)
              </label>

              <input
                type="number"
                step="0.01"
                id="fatGoal"
                name="fatGoal"
                value={formData.fatGoal}
                onChange={handleChange}
                min="0"
                placeholder="70"
                required
              />
            </div>

          </div>
                {message && (
            <p className="profile-success" role="status">
              {message}
            </p>
          )}
          {error && (
            <p className="auth-error" role="alert">
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
              : 'Save Nutrition Goals'}
          </button>

        </form>
      </div>
    </main>
  )
}

export default Goals

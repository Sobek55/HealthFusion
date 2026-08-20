import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  getPresetDiets,
  getActiveDiet,
  applyPresetDiet,
  previewPersonalizedDiet,
  savePersonalizedDiet
} from '../services/api'

function Discover() {
  const navigate = useNavigate()

  const [presets, setPresets] = useState([])
  const [selectedPlan, setSelectedPlan] =
    useState(null)

  const [activePlan, setActivePlan] =
    useState(null)

  const [isLoggedIn, setIsLoggedIn] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

  const [applying, setApplying] =
    useState(false)

  const [error, setError] =
    useState('')

  const [personalizedForm, setPersonalizedForm] =
    useState({
      primaryGoal: '',
      currentWeight: '',
      targetWeight: '',
      activityLevel: '',
      dietaryPreferences: '',
      foodRestrictions: ''
    })

  const [preview, setPreview] =
    useState(null)

  const [previewing, setPreviewing] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  useEffect(() => {
    const loadDiscover = async () => {
      try {
        setLoading(true)

        const presetData =
          await getPresetDiets()

        setPresets(
          presetData.presets || []
        )

        try {
          const activeData =
            await getActiveDiet()

          setIsLoggedIn(true)

          setActivePlan(
            activeData.plan || null
          )
        } catch {
          setIsLoggedIn(false)
          setActivePlan(null)
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDiscover()
  }, [])

  const handleApplyPlan = async plan => {
    try {
      setApplying(true)
      setError('')

      await applyPresetDiet(plan.key)

      navigate('/dashboard')
    } catch (error) {
      if (
        error.message ===
        'Authentication required'
      ) {
        navigate('/login')
        return
      }

      setError(error.message)
    } finally {
      setApplying(false)
    }
  }

  const handlePersonalizedChange = event => {
    const {
      name,
      value
    } = event.target

    setPersonalizedForm(current => ({
      ...current,
      [name]: value
    }))

    // If the user edits their answers after
    // previewing, require a new calculation.
    setPreview(null)
    setError('')
  }

  const handleOpenPersonalized = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    document
      .getElementById('personalized-plan')
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }

  const handlePreview = async event => {
    event.preventDefault()

    try {
      setPreviewing(true)
      setError('')

      const data =
        await previewPersonalizedDiet(
          personalizedForm
        )

      setPreview(data.plan)

      setTimeout(() => {
        document
          .getElementById('plan-preview')
          ?.scrollIntoView({
            behavior: 'smooth'
          })
      }, 50)
    } catch (error) {
      if (
        error.message ===
        'Authentication required'
      ) {
        navigate('/login')
        return
      }

      setError(error.message)
    } finally {
      setPreviewing(false)
    }
  }

  const handleSavePersonalized =
    async () => {
      try {
        setSaving(true)
        setError('')

        await savePersonalizedDiet(
          personalizedForm
        )

        navigate('/dashboard')
      } catch (error) {
        setError(error.message)
      } finally {
        setSaving(false)
      }
    }

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading diet plans...</p>
      </main>
    )
  }

  return (
    <main className="discover-page">
      <section className="discover-hero">
        <p className="tagline">
          DISCOVER YOUR PLAN
        </p>

        <h1>
          Find a nutrition approach that
          works for you.
        </h1>

        <p>
          Explore a preset nutrition plan
          or create a personalized plan
          based on your goals, activity
          level, and dietary needs.
        </p>
      </section>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {activePlan && (
        <section className="active-diet-banner">
          <div>
            <span>ACTIVE PLAN</span>

            <h2>
              {activePlan.plan_name}
            </h2>

            <p>
              {activePlan.description}
            </p>
          </div>
        </section>
      )}

      <section className="discover-section">
        <div className="discover-section-heading">
          <div>
            <p className="tagline">
              PRESET PLANS
            </p>

            <h2>
              Choose a starting point
            </h2>
          </div>

          <p>
            Select a plan to learn more
            before applying it to your
            account.
          </p>
        </div>

        <div className="diet-card-grid">
          {presets.map(plan => (
            <article
              className="diet-card"
              key={plan.key}
            >
              <div>
                <h3>{plan.name}</h3>

                <p>
                  {plan.description}
                </p>
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setSelectedPlan(plan)
                }
              >
                View Plan
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedPlan && (
        <section className="diet-details">
          <div className="diet-details-header">
            <div>
              <p className="tagline">
                PLAN DETAILS
              </p>

              <h2>
                {selectedPlan.name}
              </h2>

              <p>
                {selectedPlan.description}
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                setSelectedPlan(null)
              }
            >
              Close
            </button>
          </div>

          <div className="diet-detail-grid">
            <div>
              <h3>Focus</h3>

              <p>
                {selectedPlan.focus}
              </p>
            </div>

            <div>
              <h3>Best For</h3>

              <p>
                {selectedPlan.suitableFor}
              </p>
            </div>
          </div>

          <div className="diet-guidelines">
            <h3>
              General Guidelines
            </h3>

            <ul>
              {selectedPlan.guidelines.map(
                guideline => (
                  <li key={guideline}>
                    {guideline}
                  </li>
                )
              )}
            </ul>
          </div>

          <button
            type="button"
            className="primary-button"
            disabled={applying}
            onClick={() =>
              handleApplyPlan(selectedPlan)
            }
          >
            {applying
              ? 'Applying Plan...'
              : 'Apply This Plan'}
          </button>
        </section>
      )}

      <section className="personalized-plan-card">
        <div>
          <p className="tagline">
            PERSONALIZED
          </p>

          <h2>
            Create Your Own Plan
          </h2>

          <p>
            Build a nutrition plan using
            your primary goal, current and
            target weight, activity level,
            dietary preferences, and food
            restrictions.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleOpenPersonalized}
        >
          Create Personalized Plan
        </button>
      </section>

      <section
        id="personalized-plan"
        className="personalized-builder"
      >
        <div className="discover-section-heading">
          <div>
            <p className="tagline">
              BUILD YOUR PLAN
            </p>

            <h2>
              Personalized Plan Builder
            </h2>
          </div>

          <p>
            Enter your information to
            calculate recommended daily
            calorie and macronutrient
            targets.
          </p>
        </div>

        <form
          className="personalized-form"
          onSubmit={handlePreview}
        >
          <div className="personalized-form-grid">
            <label>
              Primary Goal

              <select
                name="primaryGoal"
                value={
                  personalizedForm.primaryGoal
                }
                onChange={
                  handlePersonalizedChange
                }
                required
              >
                <option value="">
                  Select a goal
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
            </label>

            <label>
              Activity Level

              <select
                name="activityLevel"
                value={
                  personalizedForm.activityLevel
                }
                onChange={
                  handlePersonalizedChange
                }
                required
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
            </label>

            <label>
              Current Weight (lb)

              <input
                type="number"
                name="currentWeight"
                min="1"
                step="0.1"
                value={
                  personalizedForm.currentWeight
                }
                onChange={
                  handlePersonalizedChange
                }
                required
              />
            </label>

            <label>
              Target Weight (lb)

              <input
                type="number"
                name="targetWeight"
                min="1"
                step="0.1"
                value={
                  personalizedForm.targetWeight
                }
                onChange={
                  handlePersonalizedChange
                }
                required
              />
            </label>
          </div>

          <label>
            Dietary Preferences

            <textarea
              name="dietaryPreferences"
              rows="3"
              placeholder="Example: High protein, Mediterranean-style foods"
              value={
                personalizedForm.dietaryPreferences
              }
              onChange={
                handlePersonalizedChange
              }
              required
            />
          </label>

          <label>
            Food Restrictions

            <textarea
              name="foodRestrictions"
              rows="3"
              placeholder="Example: No shellfish, lactose intolerant, or None"
              value={
                personalizedForm.foodRestrictions
              }
              onChange={
                handlePersonalizedChange
              }
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={previewing}
          >
            {previewing
              ? 'Calculating...'
              : 'Calculate My Plan'}
          </button>
        </form>
      </section>

      {preview && (
        <section
          id="plan-preview"
          className="personalized-preview"
        >
          <div className="preview-heading">
            <div>
              <p className="tagline">
                RECOMMENDED PLAN
              </p>

              <h2>
                {preview.planName}
              </h2>

              <p>
                Review your plan before
                saving it.
              </p>
            </div>
          </div>

          <div className="preview-summary-grid">
            <div className="preview-stat">
              <span>
                Daily Calories
              </span>

              <strong>
                {preview.calorieTarget}
              </strong>

              <small>kcal</small>
            </div>

            <div className="preview-stat">
              <span>Protein</span>

              <strong>
                {preview.proteinTarget}
              </strong>

              <small>grams</small>
            </div>

            <div className="preview-stat">
              <span>Carbohydrates</span>

              <strong>
                {preview.carbTarget}
              </strong>

              <small>grams</small>
            </div>

            <div className="preview-stat">
              <span>Fat</span>

              <strong>
                {preview.fatTarget}
              </strong>

              <small>grams</small>
            </div>
          </div>

          <div className="preview-details">
            <p>
              <strong>
                Primary Goal:
              </strong>{' '}
              {preview.primaryGoal}
            </p>

            <p>
              <strong>
                Current Weight:
              </strong>{' '}
              {preview.currentWeight} lb
            </p>

            <p>
              <strong>
                Target Weight:
              </strong>{' '}
              {preview.targetWeight} lb
            </p>

            <p>
              <strong>
                Activity Level:
              </strong>{' '}
              {preview.activityLevel}
            </p>

            <p>
              <strong>
                Estimated Maintenance:
              </strong>{' '}
              {preview.maintenanceCalories}{' '}
              kcal
            </p>

            <p>
              <strong>
                Dietary Preferences:
              </strong>{' '}
              {preview.dietaryPreferences}
            </p>

            <p>
              <strong>
                Food Restrictions:
              </strong>{' '}
              {preview.foodRestrictions}
            </p>
          </div>

          <div className="preview-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setPreview(null)

                document
                  .getElementById(
                    'personalized-plan'
                  )
                  ?.scrollIntoView({
                    behavior: 'smooth'
                  })
              }}
            >
              Modify Plan
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={saving}
              onClick={
                handleSavePersonalized
              }
            >
              {saving
                ? 'Saving Plan...'
                : 'Confirm & Save Plan'}
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

export default Discover

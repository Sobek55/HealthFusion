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
  applyPresetDiet
} from '../services/api'

function Discover() {
  const navigate = useNavigate()

  const [presets, setPresets] = useState([])
  const [selectedPlan, setSelectedPlan] =
    useState(null)

  const [activePlan, setActivePlan] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [applying, setApplying] =
    useState(false)

  const [error, setError] =
    useState('')

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

          setActivePlan(
            activeData.plan || null
          )
        } catch {
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
        <p className="auth-error">
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
            <h3>General Guidelines</h3>

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
          onClick={() =>
            document
              .getElementById(
                'personalized-plan'
              )
              ?.scrollIntoView({
                behavior: 'smooth'
              })
          }
        >
          Create Personalized Plan
        </button>
      </section>

      <section
        id="personalized-plan"
        className="personalized-coming-next"
      >
        <h2>
          Personalized Plan Builder
        </h2>

        <p>
          Personalized plan setup will
          appear here.
        </p>
      </section>
    </main>
  )
}

export default Discover
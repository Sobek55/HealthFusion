import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Link
} from 'react-router-dom'

import {
  getCurrentUser,
  getNutritionGoals,
  getMealLogs,
  getProfile,
  getWeightHistory,
  saveWeightEntry,
  deleteWeightEntry
} from '../services/api'

const getTodayDate = () => {
  const now = new Date()

  const year =
    now.getFullYear()

  const month = String(
    now.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    now.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getStartOfPeriod = (
  period
) => {
  const now = new Date()

  now.setHours(0, 0, 0, 0)

  if (period === 'week') {
    const day = now.getDay()

    const difference =
      day === 0
        ? -6
        : 1 - day

    now.setDate(
      now.getDate() +
        difference
    )
  }

  if (period === 'month') {
    now.setDate(1)
  }

  return now
}

const getGoalMultiplier = (
  period
) => {
  const now = new Date()

  if (period === 'day') {
    return 1
  }

  if (period === 'week') {
    const day = now.getDay()

    return day === 0
      ? 7
      : day
  }

  return now.getDate()
}

const formatDate = (value) => {
  if (!value) {
    return ''
  }

  const dateString =
    String(value).slice(0, 10)

  const [
    year,
    month,
    day
  ] = dateString.split('-')

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString()
}

function Dashboard() {
  const [user, setUser] =
    useState(null)

  const [profile, setProfile] =
    useState(null)

  const [goals, setGoals] =
    useState(null)

  const [mealLogs, setMealLogs] =
    useState([])

  const [
    weightHistory,
    setWeightHistory
  ] = useState([])

  const [
    selectedPeriod,
    setSelectedPeriod
  ] = useState('day')

  const [
    weightForm,
    setWeightForm
  ] = useState({
    weight: '',
    recordedDate:
      getTodayDate()
  })

  const [loading, setLoading] =
    useState(true)

  const [
    savingWeight,
    setSavingWeight
  ] = useState(false)

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setLoading(true)
          setError('')

          const [
            userData,
            goalData,
            logData,
            profileData,
            weightData
          ] = await Promise.all([
            getCurrentUser(),
            getNutritionGoals(),
            getMealLogs(),
            getProfile(),
            getWeightHistory()
          ])

          setUser(
            userData.user
          )

          setGoals(
            goalData.goals
          )

          setMealLogs(
            logData.logs || []
          )

          setProfile(
            profileData.profile ||
              null
          )

          setWeightHistory(
            weightData.history ||
              []
          )
        } catch (error) {
          setError(
            error.message
          )
        } finally {
          setLoading(false)
        }
      }

    loadDashboard()
  }, [])

  const periodLogs =
    useMemo(() => {
      const start =
        getStartOfPeriod(
          selectedPeriod
        )

      return mealLogs.filter(
        (log) => {
          const logDate =
            new Date(
              log.logged_at
            )

          return logDate >= start
        }
      )
    }, [
      mealLogs,
      selectedPeriod
    ])

  const totals =
    useMemo(() => {
      return periodLogs.reduce(
        (total, log) => {
          total.calories +=
            Number(
              log.calories
            )

          total.protein +=
            Number(
              log.protein
            )

          total.carbs +=
            Number(
              log.carbs
            )

          total.fat +=
            Number(
              log.fat
            )

          return total
        },
        {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      )
    }, [periodLogs])

  const goalMultiplier =
    getGoalMultiplier(
      selectedPeriod
    )

  const periodGoals =
    useMemo(() => {
      if (!goals) {
        return null
      }

      return {
        calories:
          Number(
            goals.calorie_goal
          ) * goalMultiplier,

        protein:
          Number(
            goals.protein_goal
          ) * goalMultiplier,

        carbs:
          Number(
            goals.carb_goal
          ) * goalMultiplier,

        fat:
          Number(
            goals.fat_goal
          ) * goalMultiplier
      }
    }, [
      goals,
      goalMultiplier
    ])

  const getProgress = (
    current,
    goal
  ) => {
    const numericGoal =
      Number(goal)

    if (
      !numericGoal ||
      numericGoal <= 0
    ) {
      return 0
    }

    return Math.min(
      (
        Number(current) /
        numericGoal
      ) * 100,
      100
    )
  }

  const calorieDifference =
    periodGoals
      ? periodGoals.calories -
        totals.calories
      : null

  const recentMeals =
    useMemo(
      () =>
        mealLogs.slice(0, 5),
      [mealLogs]
    )

  const latestWeight =
    weightHistory.length > 0
      ? Number(
          weightHistory[0]
            .weight
        )
      : profile?.weight
        ? Number(
            profile.weight
          )
        : null

  const targetWeight =
    profile?.target_weight
      ? Number(
          profile.target_weight
        )
      : null

  const weightDifference =
    latestWeight !== null &&
    targetWeight !== null
      ? latestWeight -
        targetWeight
      : null

  const weightChartEntries =
    useMemo(
      () =>
        weightHistory
          .slice(0, 10)
          .reverse(),
      [weightHistory]
    )

  const weightValues =
    weightChartEntries.map(
      (entry) =>
        Number(entry.weight)
    )

  const minimumWeight =
    weightValues.length
      ? Math.min(
          ...weightValues
        )
      : 0

  const maximumWeight =
    weightValues.length
      ? Math.max(
          ...weightValues
        )
      : 0

  const getWeightBarHeight = (
    weight
  ) => {
    if (
      maximumWeight ===
      minimumWeight
    ) {
      return 65
    }

    return (
      30 +
      (
        (
          Number(weight) -
          minimumWeight
        ) /
        (
          maximumWeight -
          minimumWeight
        )
      ) *
        70
    )
  }

  const handleWeightChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target

    setWeightForm(
      (current) => ({
        ...current,
        [name]: value
      })
    )
  }

  const handleWeightSubmit =
    async (event) => {
      event.preventDefault()

      setError('')
      setMessage('')

      const weight =
        Number(
          weightForm.weight
        )

      if (
        !Number.isFinite(
          weight
        ) ||
        weight <= 0
      ) {
        setError(
          'Enter a valid weight.'
        )

        return
      }

      try {
        setSavingWeight(true)

        const data =
          await saveWeightEntry(
            {
              weight,
              recordedDate:
                weightForm.recordedDate
            }
          )

        setMessage(
          data.message ||
            'Weight recorded successfully'
        )

        const updated =
          await getWeightHistory()

        setWeightHistory(
          updated.history || []
        )

        setWeightForm(
          (current) => ({
            ...current,
            weight: ''
          })
        )
      } catch (error) {
        setError(
          error.message
        )
      } finally {
        setSavingWeight(false)
      }
    }

  const handleDeleteWeight =
    async (weightEntryId) => {
      const confirmed =
        window.confirm(
          'Delete this weight entry?'
        )

      if (!confirmed) {
        return
      }

      try {
        setError('')
        setMessage('')

        await deleteWeightEntry(
          weightEntryId
        )

        const updated =
          await getWeightHistory()

        setWeightHistory(
          updated.history || []
        )
      } catch (error) {
        setError(
          error.message
        )
      }
    }

  if (loading) {
    return (
      <main className="page-container">
        <p>
          Loading progress...
        </p>
      </main>
    )
  }

  if (error && !user) {
    return (
      <main className="page-container">
        <p className="auth-error">
          {error}
        </p>
      </main>
    )
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="tagline">
            USER PROGRESS
          </p>

          <h1>
            Welcome back
            {user?.first_name
              ? `, ${user.first_name}`
              : ''}
            !
          </h1>

          <p>
            Track your nutrition,
            meals, and weight
            progress.
          </p>
        </div>
      </div>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}

      {message && (
        <p className="profile-success">
          {message}
        </p>
      )}

      <div className="progress-period-tabs">
        <button
          type="button"
          className={
            selectedPeriod ===
            'day'
              ? 'progress-period-button active'
              : 'progress-period-button'
          }
          onClick={() =>
            setSelectedPeriod(
              'day'
            )
          }
        >
          Day
        </button>

        <button
          type="button"
          className={
            selectedPeriod ===
            'week'
              ? 'progress-period-button active'
              : 'progress-period-button'
          }
          onClick={() =>
            setSelectedPeriod(
              'week'
            )
          }
        >
          Week
        </button>

        <button
          type="button"
          className={
            selectedPeriod ===
            'month'
              ? 'progress-period-button active'
              : 'progress-period-button'
          }
          onClick={() =>
            setSelectedPeriod(
              'month'
            )
          }
        >
          Month
        </button>
      </div>

      <section className="dashboard-summary-grid">
        <div className="dashboard-stat-card">
          <span>
            Calories Consumed
          </span>

          <strong>
            {Math.round(
              totals.calories
            )}
          </strong>

          <p>
            of{' '}
            {periodGoals
              ? Math.round(
                  periodGoals.calories
                )
              : '—'}{' '}
            kcal
          </p>

          <div className="dashboard-progress">
            <div
              style={{
                width:
                  `${getProgress(
                    totals.calories,
                    periodGoals
                      ?.calories
                  )}%`
              }}
            />
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>
            Calories Remaining
          </span>

          <strong>
            {calorieDifference ===
            null
              ? '—'
              : Math.round(
                  Math.abs(
                    calorieDifference
                  )
                )}
          </strong>

          <p>
            {calorieDifference ===
            null
              ? 'No calorie goal'
              : calorieDifference >=
                  0
                ? 'kcal remaining'
                : 'kcal over target'}
          </p>
        </div>

        <div className="dashboard-stat-card">
          <span>Protein</span>

          <strong>
            {totals.protein.toFixed(
              1
            )}
            g
          </strong>

          <p>
            of{' '}
            {periodGoals
              ? `${periodGoals.protein.toFixed(
                  0
                )}g`
              : '—'}
          </p>

          <div className="dashboard-progress">
            <div
              style={{
                width:
                  `${getProgress(
                    totals.protein,
                    periodGoals
                      ?.protein
                  )}%`
              }}
            />
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>
            Carbs / Fat
          </span>

          <strong>
            {totals.carbs.toFixed(
              0
            )}
            g /{' '}
            {totals.fat.toFixed(
              0
            )}
            g
          </strong>

          <p>
            {periodGoals
              ? `${periodGoals.carbs.toFixed(
                  0
                )}g / ${periodGoals.fat.toFixed(
                  0
                )}g targets`
              : 'No targets'}
          </p>
        </div>
      </section>

      <section className="dashboard-content-grid">
        <div className="dashboard-panel">
          <h2>
            Calorie Progress
          </h2>

          <p>
            {selectedPeriod ===
            'day'
              ? 'Today'
              : selectedPeriod ===
                  'week'
                ? 'This week through today'
                : 'This month through today'}
          </p>

          <div className="nutrition-chart">
            <div className="nutrition-chart-row">
              <span>
                Calories
              </span>

              <div className="nutrition-chart-track">
                <div
                  className="nutrition-chart-bar"
                  style={{
                    width:
                      `${getProgress(
                        totals.calories,
                        periodGoals
                          ?.calories
                      )}%`
                  }}
                />
              </div>

              <strong>
                {Math.round(
                  totals.calories
                )}
              </strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>
            Macro Progress
          </h2>

          <div className="nutrition-chart">
            <div className="nutrition-chart-row">
              <span>
                Protein
              </span>

              <div className="nutrition-chart-track">
                <div
                  className="nutrition-chart-bar"
                  style={{
                    width:
                      `${getProgress(
                        totals.protein,
                        periodGoals
                          ?.protein
                      )}%`
                  }}
                />
              </div>

              <strong>
                {totals.protein.toFixed(
                  0
                )}
                g
              </strong>
            </div>

            <div className="nutrition-chart-row">
              <span>
                Carbs
              </span>

              <div className="nutrition-chart-track">
                <div
                  className="nutrition-chart-bar"
                  style={{
                    width:
                      `${getProgress(
                        totals.carbs,
                        periodGoals
                          ?.carbs
                      )}%`
                  }}
                />
              </div>

              <strong>
                {totals.carbs.toFixed(
                  0
                )}
                g
              </strong>
            </div>

            <div className="nutrition-chart-row">
              <span>
                Fat
              </span>

              <div className="nutrition-chart-track">
                <div
                  className="nutrition-chart-bar"
                  style={{
                    width:
                      `${getProgress(
                        totals.fat,
                        periodGoals
                          ?.fat
                      )}%`
                  }}
                />
              </div>

              <strong>
                {totals.fat.toFixed(
                  0
                )}
                g
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="weight-progress-section">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <p className="tagline">
                WEIGHT PROGRESS
              </p>

              <h2>
                Record Weight
              </h2>
            </div>
          </div>

          <form
            className="weight-entry-form"
            onSubmit={
              handleWeightSubmit
            }
          >
            <div className="form-group">
              <label htmlFor="weight">
                Weight (lb)
              </label>

              <input
                id="weight"
                name="weight"
                type="number"
                min="0.1"
                step="0.1"
                value={
                  weightForm.weight
                }
                onChange={
                  handleWeightChange
                }
                placeholder="Enter weight"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recordedDate">
                Date
              </label>

              <input
                id="recordedDate"
                name="recordedDate"
                type="date"
                value={
                  weightForm.recordedDate
                }
                onChange={
                  handleWeightChange
                }
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={
                savingWeight
              }
            >
              {savingWeight
                ? 'Saving...'
                : 'Record Weight'}
            </button>
          </form>

          <div className="weight-summary-grid">
            <div>
              <span>
                Current Weight
              </span>

              <strong>
                {latestWeight !==
                null
                  ? `${latestWeight.toFixed(
                      1
                    )} lb`
                  : '—'}
              </strong>
            </div>

            <div>
              <span>
                Target Weight
              </span>

              <strong>
                {targetWeight !==
                null
                  ? `${targetWeight.toFixed(
                      1
                    )} lb`
                  : '—'}
              </strong>
            </div>

            <div>
              <span>
                Difference
              </span>

              <strong>
                {weightDifference ===
                null
                  ? '—'
                  : weightDifference ===
                      0
                    ? 'At target'
                    : `${Math.abs(
                        weightDifference
                      ).toFixed(
                        1
                      )} lb ${
                        weightDifference >
                        0
                          ? 'above'
                          : 'below'
                      }`}
              </strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>
            Weight History
          </h2>

          {weightChartEntries.length ===
          0 ? (
            <div className="dashboard-empty">
              <h3>
                No weight entries yet
              </h3>

              <p>
                Record your first
                weight to begin
                tracking progress.
              </p>
            </div>
          ) : (
            <>
              <div className="weight-chart">
                {weightChartEntries.map(
                  (entry) => (
                    <div
                      className="weight-chart-column"
                      key={
                        entry.weight_entry_id
                      }
                    >
                      <strong>
                        {Number(
                          entry.weight
                        ).toFixed(
                          1
                        )}
                      </strong>

                      <div className="weight-chart-track">
                        <div
                          className="weight-chart-bar"
                          style={{
                            height:
                              `${getWeightBarHeight(
                                entry.weight
                              )}%`
                          }}
                        />
                      </div>

                      <span>
                        {formatDate(
                          entry.recorded_date
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="weight-history-list">
                {weightHistory
                  .slice(0, 5)
                  .map(
                    (entry) => (
                      <div
                        className="weight-history-item"
                        key={
                          entry.weight_entry_id
                        }
                      >
                        <div>
                          <strong>
                            {Number(
                              entry.weight
                            ).toFixed(
                              1
                            )}{' '}
                            lb
                          </strong>

                          <span>
                            {formatDate(
                              entry.recorded_date
                            )}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="remove-log-button"
                          onClick={() =>
                            handleDeleteWeight(
                              entry.weight_entry_id
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="dashboard-content-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>
                Recent Meals
              </h2>

              <p>
                Your latest logged
                meals.
              </p>
            </div>

            <Link
              to="/meals"
              className="dashboard-meal-link"
            >
              Go to Meal Entry
            </Link>
          </div>

          {recentMeals.length ===
          0 ? (
            <div className="dashboard-empty">
              <h3>
                No meals logged
              </h3>

              <p>
                Add a meal to begin
                tracking nutrition.
              </p>
            </div>
          ) : (
            <div className="dashboard-meal-list">
              {recentMeals.map(
                (log) => (
                  <div
                    className="dashboard-meal"
                    key={
                      log.log_id
                    }
                  >
                    <div>
                      <h3>
                        {
                          log.meal_name
                        }
                      </h3>

                      <p>
                        {log.meal_type
                          ? `${log.meal_type} • `
                          : ''}

                        {Math.round(
                          Number(
                            log.calories
                          )
                        )}{' '}
                        kcal
                      </p>
                    </div>

                    <div className="dashboard-meal-macros">
                      <span>
                        P{' '}
                        {Number(
                          log.protein
                        ).toFixed(
                          1
                        )}
                        g
                      </span>

                      <span>
                        C{' '}
                        {Number(
                          log.carbs
                        ).toFixed(
                          1
                        )}
                        g
                      </span>

                      <span>
                        F{' '}
                        {Number(
                          log.fat
                        ).toFixed(
                          1
                        )}
                        g
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <h2>
            Nutrition Targets
          </h2>

          {goals ? (
            <div className="dashboard-goal-list">
              <p>
                <strong>
                  Calories:
                </strong>{' '}
                {Number(
                  goals.calorie_goal
                ).toFixed(
                  0
                )}{' '}
                kcal/day
              </p>

              <p>
                <strong>
                  Protein:
                </strong>{' '}
                {Number(
                  goals.protein_goal
                ).toFixed(
                  0
                )}
                g/day
              </p>

              <p>
                <strong>
                  Carbs:
                </strong>{' '}
                {Number(
                  goals.carb_goal
                ).toFixed(
                  0
                )}
                g/day
              </p>

              <p>
                <strong>
                  Fat:
                </strong>{' '}
                {Number(
                  goals.fat_goal
                ).toFixed(
                  0
                )}
                g/day
              </p>
            </div>
          ) : (
            <div className="dashboard-empty">
              <h3>
                No goals set
              </h3>

              <p>
                Create a personalized
                diet plan or update
                your profile.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Dashboard
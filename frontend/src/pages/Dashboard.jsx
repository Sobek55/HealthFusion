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
  getMeals,
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

const toDateInputValue = (
  value
) => {
  if (!value) {
    return ''
  }

  if (
    typeof value ===
      'string' &&
    /^\d{4}-\d{2}-\d{2}/.test(
      value
    )
  ) {
    return value.slice(
      0,
      10
    )
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return ''
  }

  const year =
    date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getPeriodStartDate = (
  period
) => {
  const now = new Date()

  now.setHours(
    0,
    0,
    0,
    0
  )

  if (period === 'week') {
    const day =
      now.getDay()

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

const getGoalMultiplier = (
  period
) => {
  const now =
    new Date()

  if (
    period ===
    'day'
  ) {
    return 1
  }

  if (
    period ===
    'week'
  ) {
    const day =
      now.getDay()

    return day === 0
      ? 7
      : day
  }

  return now.getDate()
}

const formatDate = (
  value
) => {
  const dateValue =
    toDateInputValue(
      value
    )

  if (!dateValue) {
    return ''
  }

  const [
    year,
    month,
    day
  ] =
    dateValue.split('-')

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString()
}

function Dashboard() {
  const [
    user,
    setUser
  ] = useState(null)

  const [
    profile,
    setProfile
  ] = useState(null)

  const [
    goals,
    setGoals
  ] = useState(null)

  const [
    meals,
    setMeals
  ] = useState([])

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

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    savingWeight,
    setSavingWeight
  ] = useState(false)

  const [
    error,
    setError
  ] = useState('')

  const [
    message,
    setMessage
  ] = useState('')

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setLoading(true)
          setError('')

          const userData =
            await getCurrentUser()

          setUser(
            userData.user
          )

          const [
            goalResult,
            mealResult,
            profileResult,
            weightResult
          ] =
            await Promise.allSettled([
              getNutritionGoals(),
              getMeals(),
              getProfile(),
              getWeightHistory()
            ])

          if (
            goalResult.status ===
            'fulfilled'
          ) {
            setGoals(
              goalResult.value
                .goals ||
                null
            )
          }

          if (
            mealResult.status ===
            'fulfilled'
          ) {
            setMeals(
              mealResult.value
                .meals ||
                []
            )
          }

          if (
            profileResult.status ===
            'fulfilled'
          ) {
            setProfile(
              profileResult.value
                .profile ||
                null
            )
          }

          if (
            weightResult.status ===
            'fulfilled'
          ) {
            setWeightHistory(
              weightResult.value
                .history ||
                []
            )
          }

          const failedSections =
            [
              goalResult,
              mealResult,
              profileResult,
              weightResult
            ].filter(
              result =>
                result.status ===
                'rejected'
            )

          if (
            failedSections.length >
            0
          ) {
            setError(
              'Some progress data could not be loaded. Refresh the page to retry.'
            )
          }
        } catch (err) {
          setError(
            err.message
          )
        } finally {
          setLoading(false)
        }
      }

    loadDashboard()
  }, [])

  const periodMeals =
    useMemo(() => {
      const startDate =
        getPeriodStartDate(
          selectedPeriod
        )

      const today =
        getTodayDate()

      return meals.filter(
        meal => {
          const mealDate =
            toDateInputValue(
              meal.meal_date
            )

          return (
            mealDate &&
            mealDate >=
              startDate &&
            mealDate <=
              today
          )
        }
      )
    }, [
      meals,
      selectedPeriod
    ])

  const totals =
    useMemo(() => {
      return periodMeals.reduce(
        (
          total,
          meal
        ) => ({
          calories:
            total.calories +
            (
              Number(
                meal.calories
              ) || 0
            ),

          protein:
            total.protein +
            (
              Number(
                meal.protein
              ) || 0
            ),

          carbs:
            total.carbs +
            (
              Number(
                meal.carbs
              ) || 0
            ),

          fat:
            total.fat +
            (
              Number(
                meal.fat
              ) || 0
            )
        }),
        {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      )
    }, [periodMeals])

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
          ) *
          goalMultiplier,

        protein:
          Number(
            goals.protein_goal
          ) *
          goalMultiplier,

        carbs:
          Number(
            goals.carb_goal
          ) *
          goalMultiplier,

        fat:
          Number(
            goals.fat_goal
          ) *
          goalMultiplier
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
      ) *
        100,
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
        meals.slice(
          0,
          5
        ),
      [meals]
    )

  const latestWeight =
    weightHistory.length >
    0
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
    latestWeight !==
      null &&
    targetWeight !==
      null
      ? latestWeight -
        targetWeight
      : null

  const weightChartEntries =
    useMemo(
      () =>
        weightHistory
          .slice(
            0,
            10
          )
          .reverse(),
      [weightHistory]
    )

  const weightValues =
    weightChartEntries.map(
      entry =>
        Number(
          entry.weight
        )
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
    } =
      event.target

    setWeightForm(
      current => ({
        ...current,
        [name]: value
      })
    )
  }

  const handleWeightSubmit =
    async event => {
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
        setSavingWeight(
          true
        )

        const data =
          await saveWeightEntry({
            weight,

            recordedDate:
              weightForm
                .recordedDate
          })

        setMessage(
          data.message ||
            'Weight recorded successfully'
        )

        const updated =
          await getWeightHistory()

        setWeightHistory(
          updated.history ||
            []
        )

        setWeightForm(
          current => ({
            ...current,
            weight: ''
          })
        )
      } catch (err) {
        setError(
          err.message
        )
      } finally {
        setSavingWeight(
          false
        )
      }
    }

  const handleDeleteWeight =
    async (
      weightEntryId
    ) => {
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
          updated.history ||
            []
        )
      } catch (err) {
        setError(
          err.message
        )
      }
    }

  if (loading) {
    return (
      <main className="page-container dashboard-loading-page">
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
            <strong>
              Loading your progress
            </strong>

            <p>
              Calculating nutrition,
              meals, and weight
              trends...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (
    error &&
    !user
  ) {
    return (
      <main className="page-container">
        <p className="auth-error">
          {error}
        </p>
      </main>
    )
  }

  const periodLabel =
    selectedPeriod ===
    'day'
      ? 'Today'
      : selectedPeriod ===
          'week'
        ? 'This week through today'
        : 'This month through today'

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

      <div
        className="progress-period-tabs"
        aria-label="Progress period"
      >
        {[
          'day',
          'week',
          'month'
        ].map(
          period => (
            <button
              type="button"
              key={period}
              className={
                selectedPeriod ===
                period
                  ? 'progress-period-button active'
                  : 'progress-period-button'
              }
              onClick={() =>
                setSelectedPeriod(
                  period
                )
              }
            >
              {period
                .charAt(0)
                .toUpperCase() +
                period.slice(1)}
            </button>
          )
        )}
      </div>

      <section className="dashboard-summary-grid dashboard-summary-grid-five">
        <div className="dashboard-stat-card dashboard-stat-primary">
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
                  periodGoals
                    .calories
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
          <span>
            Protein
          </span>

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
            Carbohydrates
          </span>

          <strong>
            {totals.carbs.toFixed(
              1
            )}
            g
          </strong>

          <p>
            of{' '}
            {periodGoals
              ? `${periodGoals.carbs.toFixed(
                  0
                )}g`
              : '—'}
          </p>

          <div className="dashboard-progress">
            <div
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
        </div>

        <div className="dashboard-stat-card">
          <span>
            Fat
          </span>

          <strong>
            {totals.fat.toFixed(
              1
            )}
            g
          </strong>

          <p>
            of{' '}
            {periodGoals
              ? `${periodGoals.fat.toFixed(
                  0
                )}g`
              : '—'}
          </p>

          <div className="dashboard-progress">
            <div
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
        </div>
      </section>

      <section className="dashboard-content-grid">
        <div className="dashboard-panel">
          <h2>
            Calorie Progress
          </h2>

          <p>
            {periodLabel}
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
            {[
              [
                'Protein',
                totals.protein,
                periodGoals
                  ?.protein
              ],
              [
                'Carbs',
                totals.carbs,
                periodGoals
                  ?.carbs
              ],
              [
                'Fat',
                totals.fat,
                periodGoals
                  ?.fat
              ]
            ].map(
              ([
                label,
                current,
                goal
              ]) => (
                <div
                  className="nutrition-chart-row"
                  key={label}
                >
                  <span>
                    {label}
                  </span>

                  <div className="nutrition-chart-track">
                    <div
                      className="nutrition-chart-bar"
                      style={{
                        width:
                          `${getProgress(
                            current,
                            goal
                          )}%`
                      }}
                    />
                  </div>

                  <strong>
                    {Number(
                      current
                    ).toFixed(
                      0
                    )}
                    g
                  </strong>
                </div>
              )
            )}
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
              <label htmlFor="weightEntry">
                Weight (lb)
              </label>

              <input
                id="weightEntry"
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
                  weightForm
                    .recordedDate
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
                  entry => (
                    <div
                      className="weight-chart-column"
                      key={
                        entry
                          .weight_entry_id
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
                          entry
                            .recorded_date
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="weight-history-list">
                {weightHistory
                  .slice(
                    0,
                    5
                  )
                  .map(
                    entry => (
                      <div
                        className="weight-history-item"
                        key={
                          entry
                            .weight_entry_id
                        }
                      >
                        <div>
                          <strong>
                            {Number(
                              entry
                                .weight
                            ).toFixed(
                              1
                            )}{' '}
                            lb
                          </strong>

                          <span>
                            {formatDate(
                              entry
                                .recorded_date
                            )}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="remove-log-button"
                          onClick={() =>
                            handleDeleteWeight(
                              entry
                                .weight_entry_id
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
                Your latest recorded
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
                No meals recorded
              </h3>

              <p>
                Add a meal to begin
                tracking nutrition.
              </p>
            </div>
          ) : (
            <div className="dashboard-meal-list">
              {recentMeals.map(
                meal => (
                  <div
                    className="dashboard-meal"
                    key={
                      meal.meal_id
                    }
                  >
                    <div>
                      <h3>
                        {
                          meal
                            .meal_name
                        }
                      </h3>

                      <p>
                        {meal
                          .meal_type
                          ? `${meal.meal_type} • `
                          : ''}
                        {Math.round(
                          Number(
                            meal
                              .calories
                          ) || 0
                        )}{' '}
                        kcal
                      </p>

                      <p>
                        {formatDate(
                          meal
                            .meal_date
                        )}
                      </p>
                    </div>

                    <div className="dashboard-meal-macros">
                      <span>
                        P{' '}
                        {Number(
                          meal.protein ||
                            0
                        ).toFixed(
                          1
                        )}
                        g
                      </span>

                      <span>
                        C{' '}
                        {Number(
                          meal.carbs ||
                            0
                        ).toFixed(
                          1
                        )}
                        g
                      </span>

                      <span>
                        F{' '}
                        {Number(
                          meal.fat ||
                            0
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
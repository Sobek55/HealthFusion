import { useEffect, useMemo, useState } from 'react'

import {
  getCurrentUser,
  getNutritionGoals,
  getTodayMealLogs
} from '../services/api'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [goals, setGoals] = useState(null)
  const [todayLogs, setTodayLogs] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          userData,
          goalData,
          logData
        ] = await Promise.all([
          getCurrentUser(),
          getNutritionGoals(),
          getTodayMealLogs()
        ])

        setUser(userData.user)
        setGoals(goalData.goals)
        setTodayLogs(logData.logs || [])
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const totals = useMemo(() => {
    return todayLogs.reduce(
      (total, log) => {
        total.calories += Number(log.calories)
        total.protein += Number(log.protein)
        total.carbs += Number(log.carbs)
        total.fat += Number(log.fat)

        return total
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    )
  }, [todayLogs])

  const getProgress = (current, goal) => {
    const numericGoal = Number(goal)

    if (!numericGoal || numericGoal <= 0) {
      return 0
    }

    return Math.min(
      (Number(current) / numericGoal) * 100,
      100
    )
  }

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading dashboard...</p>
      </main>
    )
  }

  if (error) {
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
            TODAY'S OVERVIEW
          </p>

          <h1>
            Welcome back
            {user?.first_name
              ? `, ${user.first_name}`
              : ''}
            !
          </h1>

          <p>
            Here's how you're doing today.
          </p>
        </div>
      </div>

      <section className="dashboard-summary-grid">
        <div className="dashboard-stat-card">
          <span>Calories</span>

          <strong>
            {Math.round(totals.calories)}
          </strong>

          <p>
            of{' '}
            {goals?.calorie_goal
              ? Math.round(
                  Number(goals.calorie_goal)
                )
              : '—'}{' '}
            kcal
          </p>

          <div className="dashboard-progress">
            <div
              style={{
                width: `${getProgress(
                  totals.calories,
                  goals?.calorie_goal
                )}%`
              }}
            />
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>Protein</span>

          <strong>
            {totals.protein.toFixed(1)}g
          </strong>

          <p>
            of{' '}
            {goals?.protein_goal
              ? `${Number(
                  goals.protein_goal
                ).toFixed(0)}g`
              : '—'}
          </p>

          <div className="dashboard-progress">
            <div
              style={{
                width: `${getProgress(
                  totals.protein,
                  goals?.protein_goal
                )}%`
              }}
            />
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>Carbs</span>

          <strong>
            {totals.carbs.toFixed(1)}g
          </strong>

          <p>
            of{' '}
            {goals?.carb_goal
              ? `${Number(
                  goals.carb_goal
                ).toFixed(0)}g`
              : '—'}
          </p>

          <div className="dashboard-progress">
            <div
              style={{
                width: `${getProgress(
                  totals.carbs,
                  goals?.carb_goal
                )}%`
              }}
            />
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>Fat</span>

          <strong>
            {totals.fat.toFixed(1)}g
          </strong>

          <p>
            of{' '}
            {goals?.fat_goal
              ? `${Number(
                  goals.fat_goal
                ).toFixed(0)}g`
              : '—'}
          </p>

          <div className="dashboard-progress">
            <div
              style={{
                width: `${getProgress(
                  totals.fat,
                  goals?.fat_goal
                )}%`
              }}
            />
          </div>
        </div>
      </section>

      <section className="dashboard-content-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Today's Meals</h2>

              <p>
                {todayLogs.length}{' '}
                {todayLogs.length === 1
                  ? 'meal'
                  : 'meals'}{' '}
                logged today
              </p>
            </div>
          </div>

          {todayLogs.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No meals logged yet</h3>
              <p>
                Go to Meals to log your first meal
                for today.
              </p>
            </div>
          ) : (
            <div className="dashboard-meal-list">
              {todayLogs.map((log) => (
                <div
                  className="dashboard-meal"
                  key={log.log_id}
                >
                  <div>
                    <h3>{log.meal_name}</h3>

                    <p>
                      {Math.round(
                        Number(log.calories)
                      )}{' '}
                      kcal
                    </p>
                  </div>

                  <div className="dashboard-meal-macros">
                    <span>
                      P {Number(
                        log.protein
                      ).toFixed(1)}g
                    </span>

                    <span>
                      C {Number(
                        log.carbs
                      ).toFixed(1)}g
                    </span>

                    <span>
                      F {Number(
                        log.fat
                      ).toFixed(1)}g
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <h2>Daily Goals</h2>

          {goals ? (
            <div className="dashboard-goal-list">
              <p>
                <strong>Calories:</strong>{' '}
                {Number(
                  goals.calorie_goal
                ).toFixed(0)}{' '}
                kcal
              </p>

              <p>
                <strong>Protein:</strong>{' '}
                {Number(
                  goals.protein_goal
                ).toFixed(0)}g
              </p>

              <p>
                <strong>Carbs:</strong>{' '}
                {Number(
                  goals.carb_goal
                ).toFixed(0)}g
              </p>

              <p>
                <strong>Fat:</strong>{' '}
                {Number(
                  goals.fat_goal
                ).toFixed(0)}g
              </p>
            </div>
          ) : (
            <div className="dashboard-empty">
              <h3>No goals set</h3>

              <p>
                Visit the Goals page to set your
                daily nutrition targets.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Dashboard
require('dotenv').config()

const express = require('express')
const cookieParser =
  require('cookie-parser')

const healthRoutes =
  require('./routes/healthRoutes')

const authRoutes =
  require('./routes/authRoutes')

const profileRoutes =
  require('./routes/profileRoutes')

const goalsRoutes =
  require('./routes/goalsRoutes')

const foodRoutes =
  require('./routes/foodRoutes')

const mealRoutes =
  require('./routes/mealRoutes')

const mealLogRoutes =
  require('./routes/mealLogRoutes')

const dietRoutes =
  require('./routes/dietRoutes')

const weightHistoryRoutes =
  require('./routes/weightHistoryRoutes')

const {
  notFound,
  errorHandler
} = require('./middleware/errorMiddleware')

const app = express()

const PORT =
  process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use(
  '/api/health',
  healthRoutes
)

app.use(
  '/api/auth',
  authRoutes
)

app.use(
  '/api/profile',
  profileRoutes
)

app.use(
  '/api/goals',
  goalsRoutes
)

app.use(
  '/api/foods',
  foodRoutes
)

app.use(
  '/api/meals',
  mealRoutes
)

app.use(
  '/api/meal-logs',
  mealLogRoutes
)

app.use(
  '/api/diets',
  dietRoutes
)

app.use(
  '/api/weights',
  weightHistoryRoutes
)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(
    `HealthFusion API running on port ${PORT}`
  )
})
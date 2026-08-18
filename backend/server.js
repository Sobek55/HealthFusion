require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')

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

// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json())
app.use(cookieParser())

// ========================================
// API ROUTES
// ========================================

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

// ========================================
// SERVE REACT FRONTEND IN PRODUCTION
// ========================================

const frontendPath = path.join(
  __dirname,
  '../frontend/dist'
)

app.use(
  express.static(frontendPath)
)

// Any non-API request should load React.
// This allows React Router URLs such as
// /discover, /dashboard, /meals, etc.
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api/')
  ) {
    return next()
  }

  res.sendFile(
    path.join(
      frontendPath,
      'index.html'
    ),
    (error) => {
      if (error) {
        next(error)
      }
    }
  )
})

// ========================================
// ERROR HANDLING
// ========================================

app.use(notFound)
app.use(errorHandler)

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(
    `HealthFusion running on port ${PORT}`
  )
})
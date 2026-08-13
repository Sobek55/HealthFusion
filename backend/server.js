const express = require('express')
const cookieParser =
  require('cookie-parser')

const healthRoutes =
  require('./routes/healthRoutes')

const authRoutes =
  require('./routes/authRoutes')

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

app.listen(PORT, () => {
  console.log(
    `HealthFusion API running on port ${PORT}`
  )
})
require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')

const healthRoutes = require('./routes/healthRoutes')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const goalsRoutes = require('./routes/goalsRoutes')

const app = express()

const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/goals', goalsRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`HealthFusion API running on port ${PORT}`)
})
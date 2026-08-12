const express = require('express')
const healthRoutes = require('./routes/healthRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

const PORT = process.env.PORT || 5000

// Allows Express to read JSON request bodies
app.use(express.json())

// API routes
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`HealthFusion API running on port ${PORT}`)
})
const express = require('express')
const healthRoutes = require('./routes/healthRoutes')

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())

app.use('/api/health', healthRoutes)

app.listen(PORT, () => {
  console.log(`HealthFusion API running on port ${PORT}`)
})
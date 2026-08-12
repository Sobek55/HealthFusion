const express = require('express')
const pool = require('../config/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1')

    res.status(200).json({
      status: 'ok',
      api: 'connected',
      database: 'connected',
      message: 'HealthFusion API and database are running'
    })
  } catch (error) {
    console.error('Database connection failed:', error)

    res.status(500).json({
      status: 'error',
      api: 'connected',
      database: 'disconnected',
      message: 'HealthFusion API is running, but database connection failed'
    })
  }
})

module.exports = router
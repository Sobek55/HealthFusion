const express = require('express')

const {
  logMeal,
  getMealLogs,
  getTodayMealLogs,
  deleteMealLog
} = require('../controllers/mealLogController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getMealLogs)

router.get('/today', protect, getTodayMealLogs)

router.post('/:mealId', protect, logMeal)

router.delete('/:logId', protect, deleteMealLog)

module.exports = router
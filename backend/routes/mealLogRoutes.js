const express = require('express')

const {
  logMeal,
  getMealLogs,
  getTodayMealLogs,
  deleteMealLog
} = require('../controllers/mealLogController')

const protect = require('../middleware/authMiddleware')

const {
  validatePositiveIntegerParam
} = require('../middleware/validationMiddleware')

const router = express.Router()

const validateMealId =
  validatePositiveIntegerParam('mealId')

const validateLogId =
  validatePositiveIntegerParam('logId')

router.get('/', protect, getMealLogs)

router.get('/today', protect, getTodayMealLogs)

router.post(
  '/:mealId',
  protect,
  validateMealId,
  logMeal
)

router.delete(
  '/:logId',
  protect,
  validateLogId,
  deleteMealLog
)

module.exports = router
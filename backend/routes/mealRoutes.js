const express = require('express')

const {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal
} = require('../controllers/mealController')

const protect = require('../middleware/authMiddleware')

const {
  validatePositiveIntegerParam
} = require('../middleware/validationMiddleware')

const router = express.Router()

const validateMealId =
  validatePositiveIntegerParam('mealId')

router.get('/', protect, getMeals)

router.get(
  '/:mealId',
  protect,
  validateMealId,
  getMeal
)

router.post('/', protect, createMeal)

router.put(
  '/:mealId',
  protect,
  validateMealId,
  updateMeal
)

router.delete(
  '/:mealId',
  protect,
  validateMealId,
  deleteMeal
)

module.exports = router
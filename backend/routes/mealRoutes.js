const express = require('express')

const {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal
} = require('../controllers/mealController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getMeals)

router.get('/:mealId', protect, getMeal)

router.post('/', protect, createMeal)

router.put('/:mealId', protect, updateMeal)

router.delete('/:mealId', protect, deleteMeal)

module.exports = router
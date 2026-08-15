const express = require('express')

const {
  createMeal
} = require('../controllers/mealController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createMeal)

module.exports = router
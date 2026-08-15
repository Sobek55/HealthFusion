const express = require('express')

const {
  getFoods
} = require('../controllers/foodController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getFoods)

module.exports = router
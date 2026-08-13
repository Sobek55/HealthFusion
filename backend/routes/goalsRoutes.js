const express = require('express')

const protect = require('../middleware/authMiddleware')

const {
  getGoals,
  saveGoals
} = require('../controllers/goalsController')

const router = express.Router()

router.get('/', protect, getGoals)
router.put('/', protect, saveGoals)

module.exports = router
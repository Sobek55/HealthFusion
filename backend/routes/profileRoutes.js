const express = require('express')

const protect = require('../middleware/authMiddleware')

const {
  validateProfile
} = require('../middleware/validationMiddleware')

const {
  getProfile,
  saveProfile
} = require('../controllers/profileController')

const router = express.Router()

router.get('/', protect, getProfile)

router.put(
  '/',
  protect,
  validateProfile,
  saveProfile
)

module.exports = router
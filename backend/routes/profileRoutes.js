const express = require('express')
const protect = require('../middleware/authMiddleware')

const {
  getProfile,
  saveProfile
} = require('../controllers/profileController')

const router = express.Router()

router.get('/', protect, getProfile)
router.put('/', protect, saveProfile)

module.exports = router
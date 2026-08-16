const express = require('express')

const protect =
  require('../middleware/authMiddleware')

const {
  getPresetDiets,
  getActiveDiet,
  saveDiet,
  previewPersonalizedDiet,
  savePersonalizedDiet
} = require('../controllers/dietController')

const router = express.Router()

// Anyone can browse preset plans
router.get(
  '/presets',
  getPresetDiets
)

// Logged-in user's current diet
router.get(
  '/active',
  protect,
  getActiveDiet
)

// Apply a preset plan
router.post(
  '/',
  protect,
  saveDiet
)

// Calculate without saving
router.post(
  '/personalized/preview',
  protect,
  previewPersonalizedDiet
)

// Confirm and save personalized plan
router.post(
  '/personalized',
  protect,
  savePersonalizedDiet
)

module.exports = router
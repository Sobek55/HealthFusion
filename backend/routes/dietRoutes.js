const express = require('express')

const protect =
  require('../middleware/authMiddleware')

const {
  getPresetDiets,
  getActiveDiet,
  saveDiet
} = require('../controllers/dietController')

const router = express.Router()

// Visitors can view preset diets
router.get('/presets', getPresetDiets)

// Account-specific diet information
router.get('/active', protect, getActiveDiet)

// Apply/save a diet plan
router.post('/', protect, saveDiet)

module.exports = router
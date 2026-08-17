const express = require('express')

const protect =
  require('../middleware/authMiddleware')

const {
  validatePositiveIntegerParam
} = require('../middleware/validationMiddleware')

const {
  getWeightHistory,
  saveWeightEntry,
  deleteWeightEntry
} = require('../controllers/weightHistoryController')

const router = express.Router()

const validateWeightEntryId =
  validatePositiveIntegerParam(
    'weightEntryId'
  )

router.get(
  '/',
  protect,
  getWeightHistory
)

router.post(
  '/',
  protect,
  saveWeightEntry
)

router.delete(
  '/:weightEntryId',
  protect,
  validateWeightEntryId,
  deleteWeightEntry
)

module.exports = router
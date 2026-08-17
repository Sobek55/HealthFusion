const express =
  require('express')

const {
  getFoods,
  createFood
} = require(
  '../controllers/foodController'
)

const protect =
  require(
    '../middleware/authMiddleware'
  )

const router =
  express.Router()

router.get(
  '/',
  protect,
  getFoods
)

router.post(
  '/',
  protect,
  createFood
)

module.exports = router
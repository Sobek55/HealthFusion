const express = require('express')

const {
  register,
  login,
  getPasswordHint,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout
} = require('../controllers/authController')

const protect =
  require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.post(
  '/password-hint',
  getPasswordHint
)

router.post(
  '/forgot-password',
  forgotPassword
)

router.post(
  '/reset-password',
  resetPassword
)

router.post('/logout', logout)

router.get(
  '/me',
  protect,
  getCurrentUser
)

module.exports = router

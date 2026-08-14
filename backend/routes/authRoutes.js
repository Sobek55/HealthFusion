const express = require('express')

const {
  register,
  login
} = require('../controllers/authController')

const {
  protect
} = require('../middleware/authMiddleware')

const User = require('../models/User')

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get current user error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve user'
    })
  }
})

module.exports = router
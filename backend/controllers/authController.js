const bcrypt = require('bcryptjs')
const User = require('../models/User')

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      })
    }

    const existingUser = await User.findByEmail(normalizedEmail)

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const userId = await User.create(
      firstName.trim(),
      lastName.trim(),
      normalizedEmail,
      passwordHash
    )

    const user = await User.findById(userId)

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user
    })
  } catch (error) {
    console.error('Registration error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create account'
    })
  }
}

module.exports = {
  register
}
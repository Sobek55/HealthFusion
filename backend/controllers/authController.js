const bcrypt = require('bcrypt')
const User = require('../models/User')

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    const existingUser = await User.findByEmail(email)

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const userId = await User.create(
      firstName,
      lastName,
      email,
      passwordHash
    )

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        userId,
        firstName,
        lastName,
        email
      }
    })
  } catch (error) {
    console.error('Registration error:', error)

    res.status(500).json({
      message: 'Unable to create account'
    })
  }
}

module.exports = {
  register
}
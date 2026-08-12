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

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findByEmail(normalizedEmail)

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const userId = await User.create(
      firstName.trim(),
      lastName.trim(),
      normalizedEmail,
      passwordHash
    )

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail
      }
    })
  } catch (error) {
    console.error('Registration error:', error)

    res.status(500).json({
      message: 'Unable to create account'
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await User.findByEmail(normalizedEmail)

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)

    res.status(500).json({
      message: 'Unable to log in'
    })
  }
}

module.exports = {
  register,
  login
}
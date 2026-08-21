const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')

const createToken = (userId) => {
  return jwt.sign(
    {
      userId
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  )
}

const hashResetToken = (token) =>
  crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      passwordHint
    } = req.body

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    const normalizedEmail =
      email.trim().toLowerCase()

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    const existingUser =
      await User.findByEmail(normalizedEmail)

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          'An account with this email already exists'
      })
    }

    const passwordHash =
      await bcrypt.hash(password, 12)

    const cleanedHint =
      passwordHint?.trim() || null

    const userId = await User.create(
      firstName.trim(),
      lastName.trim(),
      normalizedEmail,
      passwordHash,
      cleanedHint
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

const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const normalizedEmail =
      email.trim().toLowerCase()

    const user =
      await User.findByEmail(normalizedEmail)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password_hash
      )

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token =
      createToken(user.user_id)

    res.cookie(
      'healthfusion_token',
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      }
    )

    return res.status(200).json({
      success: true,
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

    return res.status(500).json({
      success: false,
      message: 'Unable to log in'
    })
  }
}

const getPasswordHint = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    const user = await User.findByEmail(
      email.trim().toLowerCase()
    )

    return res.status(200).json({
      success: true,
      hint: user?.password_hint || null,
      message: user?.password_hint
        ? 'Password hint found'
        : 'No password hint is available for this account'
    })
  } catch (error) {
    console.error('Password hint error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve password hint'
    })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    const normalizedEmail =
      email.trim().toLowerCase()

    const user =
      await User.findByEmail(normalizedEmail)

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          'If an account exists for that email, password reset instructions are available.'
      })
    }

    const resetToken =
      crypto.randomBytes(32).toString('hex')

    const tokenHash =
      hashResetToken(resetToken)

    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    )

    await User.saveResetToken(
      user.user_id,
      tokenHash,
      expiresAt
    )

    const response = {
      success: true,
      message:
        'Password reset request created. The reset link expires in 15 minutes.'
    }

    // Local capstone/demo mode: expose the temporary token so
    // the reset flow can be tested without an email provider.
    // Production should email the token instead.
    if (process.env.NODE_ENV !== 'production') {
      response.resetToken = resetToken
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error('Forgot password error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create password reset request'
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const {
      token,
      password
    } = req.body

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      })
    }

    const tokenHash =
      hashResetToken(token)

    const resetRecord =
      await User.findResetToken(tokenHash)

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired'
      })
    }

    const passwordHash =
      await bcrypt.hash(password, 12)

    await User.updatePassword(
      resetRecord.user_id,
      passwordHash
    )

    await User.deleteResetTokens(
      resetRecord.user_id
    )

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to reset password'
    })
  }
}

const getCurrentUser = async (req, res) => {
  try {
    const user =
      await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.status(200).json({
      success: true,
      user: {
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        createdAt: user.created_at
      }
    })
  } catch (error) {
    console.error(
      'Current user error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to retrieve user information'
    })
  }
}

const logout = (req, res) => {
  res.clearCookie(
    'healthfusion_token',
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  )

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
}

module.exports = {
  register,
  login,
  getPasswordHint,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout
}

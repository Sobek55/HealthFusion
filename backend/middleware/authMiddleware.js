const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    const token = req.cookies.healthfusion_token

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required'
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired session'
    })
  }
}

module.exports = protect
const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  )

  res.status(404)
  next(error)
}

const errorHandler = (error, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500

  console.error(error)

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? 'An unexpected server error occurred'
        : error.message
  })
}

module.exports = {
  notFound,
  errorHandler
}
const activityLevels = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Very Active',
  'Extremely Active'
]

const validatePositiveIntegerParam = (paramName) => {
  return (req, res, next) => {
    const value = Number(req.params[paramName])

    if (!Number.isInteger(value) || value <= 0) {
      return res.status(400).json({
        success: false,
        message: `${paramName} must be a valid positive integer`
      })
    }

    next()
  }
}

const validateProfile = (req, res, next) => {
  const {
    age,
    height,
    weight,
    activityLevel
  } = req.body

  if (age !== undefined && age !== '') {
    const numericAge = Number(age)

    if (
      !Number.isInteger(numericAge) ||
      numericAge < 1 ||
      numericAge > 120
    ) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a whole number between 1 and 120'
      })
    }
  }

  if (height !== undefined && height !== '') {
    const numericHeight = Number(height)

    if (
      !Number.isFinite(numericHeight) ||
      numericHeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Height must be a number greater than zero'
      })
    }
  }

  if (weight !== undefined && weight !== '') {
    const numericWeight = Number(weight)

    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Weight must be a number greater than zero'
      })
    }
  }

  if (
    activityLevel !== undefined &&
    activityLevel !== '' &&
    !activityLevels.includes(activityLevel)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please select a valid activity level'
    })
  }

  next()
}

module.exports = {
  validatePositiveIntegerParam,
  validateProfile
}
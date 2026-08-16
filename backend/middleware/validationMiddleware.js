const activityLevels = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Highly Active'
]

const healthGoals = [
  'Weight Loss',
  'Muscle Gain',
  'Weight Maintenance',
  'Improved Nutrition'
]

const validatePositiveIntegerParam = (
  paramName
) => {
  return (req, res, next) => {
    const value =
      Number(req.params[paramName])

    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          `${paramName} must be a valid positive integer`
      })
    }

    next()
  }
}

const validateProfile = (
  req,
  res,
  next
) => {
  const {
    age,
    height,
    weight,
    targetWeight,
    healthGoal,
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
        message:
          'Age must be a whole number between 1 and 120'
      })
    }
  }

  if (
    height !== undefined &&
    height !== ''
  ) {
    const numericHeight =
      Number(height)

    if (
      !Number.isFinite(numericHeight) ||
      numericHeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Height must be a number greater than zero'
      })
    }
  }

  if (
    weight !== undefined &&
    weight !== ''
  ) {
    const numericWeight =
      Number(weight)

    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Weight must be a number greater than zero'
      })
    }
  }

  if (
    targetWeight !== undefined &&
    targetWeight !== ''
  ) {
    const numericTargetWeight =
      Number(targetWeight)

    if (
      !Number.isFinite(
        numericTargetWeight
      ) ||
      numericTargetWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Target weight must be a number greater than zero'
      })
    }
  }

  if (
    healthGoal &&
    !healthGoals.includes(healthGoal)
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Please select a valid health goal'
    })
  }

  if (
    activityLevel &&
    !activityLevels.includes(
      activityLevel
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Please select a valid activity level'
    })
  }

  next()
}

module.exports = {
  validatePositiveIntegerParam,
  validateProfile
}
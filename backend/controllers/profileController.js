const Profile = require('../models/Profile')
const NutritionGoal =
  require('../models/NutritionGoal')

const {
  calculateNutritionTargets
} = require('../utils/nutritionCalculator')

const getProfile = async (req, res) => {
  try {
    const profile =
      await Profile.findByUserId(
        req.user.userId
      )

    return res.status(200).json({
      success: true,
      profile: profile || null
    })
  } catch (error) {
    console.error(
      'Get profile error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to retrieve profile'
    })
  }
}

const optionalNumber = value => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return null
  }

  return Number(value)
}

const optionalText = value => {
  if (
    value === undefined ||
    value === null
  ) {
    return null
  }

  const trimmed = String(value).trim()

  return trimmed || null
}

const saveProfile = async (req, res) => {
  try {
    const {
      age,
      height,
      weight,
      targetWeight,
      healthGoal,
      activityLevel,
      dietaryPreferences,
      foodRestrictions
    } = req.body

    const profile = await Profile.save(
      req.user.userId,
      optionalNumber(age),
      optionalNumber(height),
      optionalNumber(weight),
      optionalNumber(targetWeight),
      optionalText(healthGoal),
      optionalText(activityLevel),
      optionalText(dietaryPreferences),
      optionalText(foodRestrictions)
    )

    let goals = null

    /*
      Recalculate targets when the profile
      contains everything the HealthFusion
      formula requires.
    */
    if (
      profile.weight &&
      profile.health_goal &&
      profile.activity_level
    ) {
      const calculated =
        calculateNutritionTargets(
          profile.weight,
          profile.activity_level,
          profile.health_goal
        )

      goals = await NutritionGoal.save(
        req.user.userId,
        calculated.calorieTarget,
        calculated.proteinTarget,
        calculated.carbTarget,
        calculated.fatTarget
      )
    }

    return res.status(200).json({
      success: true,
      message:
        'Profile saved successfully',
      profile,
      goals
    })
  } catch (error) {
    console.error(
      'Save profile error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to save profile'
    })
  }
}

module.exports = {
  getProfile,
  saveProfile
}
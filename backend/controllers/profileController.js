const Profile =
  require('../models/Profile')

const NutritionGoal =
  require('../models/NutritionGoal')

const DietPlan =
  require('../models/DietPlan')

const {
  calculateNutritionTargets,
  defaultMacroSplit,
  presetMacroSplits
} = require(
  '../utils/nutritionCalculator'
)

const getProfile = async (
  req,
  res
) => {
  try {
    const profile =
      await Profile.findByUserId(
        req.user.userId
      )

    return res
      .status(200)
      .json({
        success: true,
        profile:
          profile || null
      })
  } catch (error) {
    console.error(
      'Get profile error:',
      error
    )

    return res
      .status(500)
      .json({
        success: false,
        message:
          'Unable to retrieve profile'
      })
  }
}

const optionalNumber =
  value => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return null
    }

    return Number(value)
  }

const optionalText =
  value => {
    if (
      value === undefined ||
      value === null
    ) {
      return null
    }

    const trimmed =
      String(value).trim()

    return trimmed || null
  }

const saveProfile = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId

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

    /*
      First save the user's
      Profile information.
    */
    const profile =
      await Profile.save(
        userId,
        optionalNumber(age),
        optionalNumber(height),
        optionalNumber(weight),
        optionalNumber(
          targetWeight
        ),
        optionalText(
          healthGoal
        ),
        optionalText(
          activityLevel
        ),
        optionalText(
          dietaryPreferences
        ),
        optionalText(
          foodRestrictions
        )
      )

    let goals = null

    /*
      Find the user's currently
      active diet plan.

      This allows Profile to preserve
      the correct macro split instead
      of always using 30/40/30.
    */
    let activePlan =
      await DietPlan.findByUserId(
        userId
      )

    /*
      Only recalculate if the Profile
      contains all information required
      by the nutrition calculator.
    */
    if (
      profile.weight &&
      profile.health_goal &&
      profile.activity_level
    ) {
      /*
        Personalized plans use
        the default 30/40/30 split.

        Preset plans use their own
        specific macro distribution.
      */
      let macroSplit =
        defaultMacroSplit

      if (
        activePlan?.plan_type ===
          'preset' &&
        activePlan.preset_key
      ) {
        macroSplit =
          presetMacroSplits[
            activePlan.preset_key
          ] ||
          defaultMacroSplit
      }

      /*
        Recalculate calories using
        the updated Profile information
        while respecting the active
        diet's macro split.
      */
      const calculated =
        calculateNutritionTargets(
          profile.weight,
          profile.activity_level,
          profile.health_goal,
          macroSplit
        )

      /*
        Update Nutrition Goals.
      */
      goals =
        await NutritionGoal.save(
          userId,
          calculated.calorieTarget,
          calculated.proteinTarget,
          calculated.carbTarget,
          calculated.fatTarget
        )

      /*
        If the user already has an
        active diet plan, update its
        stored Profile information and
        calculated targets as well.
      */
      if (activePlan) {
        activePlan =
          await DietPlan
            .updateFromProfile(
              userId,
              profile,
              calculated
            )
      }
    }

    return res
      .status(200)
      .json({
        success: true,

        message:
          'Profile saved successfully',

        profile,
        goals,
        activePlan
      })
  } catch (error) {
    console.error(
      'Save profile error:',
      error
    )

    return res
      .status(500)
      .json({
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

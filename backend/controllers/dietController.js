const DietPlan =
  require('../models/DietPlan')

const NutritionGoal =
  require('../models/NutritionGoal')

const Profile =
  require('../models/Profile')

const presetDiets = [
  {
    key: 'balanced',

    name:
      'Balanced Nutrition',

    description:
      'A flexible plan focused on balanced meals and consistent nutrition.',

    focus:
      'Balanced intake of protein, carbohydrates, fats, fruits, and vegetables.',

    suitableFor:
      'General wellness, weight maintenance, and users looking for a flexible approach.',

    macroSplit: {
      protein: 0.30,
      carbs: 0.40,
      fat: 0.30
    },

    guidelines: [
      'Include a protein source with each main meal.',
      'Choose fruits and vegetables throughout the day.',
      'Use whole-food carbohydrate sources when possible.',
      'Include moderate amounts of healthy fats.'
    ]
  },

  {
    key: 'high-protein',

    name:
      'High Protein',

    description:
      'A protein-focused plan designed to support muscle development and recovery.',

    focus:
      'Higher protein intake while maintaining balanced carbohydrate and fat intake.',

    suitableFor:
      'Active users, resistance training, and muscle-focused goals.',

    macroSplit: {
      protein: 0.40,
      carbs: 0.35,
      fat: 0.25
    },

    guidelines: [
      'Prioritize lean protein sources.',
      'Distribute protein throughout the day.',
      'Include carbohydrates around activity.',
      'Maintain adequate fruit and vegetable intake.'
    ]
  },

  {
    key: 'mediterranean',

    name:
      'Mediterranean',

    description:
      'A whole-food plan emphasizing vegetables, fruits, grains, seafood, and healthy fats.',

    focus:
      'Whole foods and plant-forward meals with moderate lean protein.',

    suitableFor:
      'Users seeking a flexible whole-food eating pattern.',

    macroSplit: {
      protein: 0.25,
      carbs: 0.45,
      fat: 0.30
    },

    guidelines: [
      'Emphasize vegetables and fruits.',
      'Choose whole grains and legumes.',
      'Use foods such as olive oil, nuts, and seeds for fats.',
      'Include fish and other lean protein sources.'
    ]
  },

  {
    key: 'lower-carb',

    name:
      'Lower Carbohydrate',

    description:
      'A plan that reduces carbohydrate intake while emphasizing protein, vegetables, and fats.',

    focus:
      'Moderate carbohydrate intake with greater emphasis on protein and non-starchy vegetables.',

    suitableFor:
      'Users who prefer meals with fewer carbohydrate-heavy foods.',

    macroSplit: {
      protein: 0.35,
      carbs: 0.25,
      fat: 0.40
    },

    guidelines: [
      'Prioritize protein at each meal.',
      'Choose non-starchy vegetables frequently.',
      'Use moderate portions of carbohydrate foods.',
      'Include healthy fat sources.'
    ]
  }
]

const activityMultipliers = {
  Sedentary: 12,
  'Lightly Active': 14,
  'Moderately Active': 16,
  'Highly Active': 18
}

const goalAdjustments = {
  'Weight Loss': -500,
  'Muscle Gain': 300,
  'Weight Maintenance': 0,
  'Improved Nutrition': 0
}

const DEFAULT_PRESET_CALORIES =
  2000

const roundOneDecimal = (
  value
) => {
  return (
    Math.round(value * 10) /
    10
  )
}

const calculateMacros = (
  calorieTarget,
  macroSplit
) => {
  const proteinTarget =
    roundOneDecimal(
      (
        calorieTarget *
        macroSplit.protein
      ) / 4
    )

  const carbTarget =
    roundOneDecimal(
      (
        calorieTarget *
        macroSplit.carbs
      ) / 4
    )

  const fatTarget =
    roundOneDecimal(
      (
        calorieTarget *
        macroSplit.fat
      ) / 9
    )

  return {
    proteinTarget,
    carbTarget,
    fatTarget
  }
}

const calculateCaloriesFromProfile =
  (profile) => {
    if (
      !profile ||
      !profile.weight ||
      !profile.activity_level ||
      !profile.health_goal
    ) {
      return null
    }

    const weight =
      Number(profile.weight)

    const activityMultiplier =
      activityMultipliers[
        profile.activity_level
      ]

    const goalAdjustment =
      goalAdjustments[
        profile.health_goal
      ]

    if (
      !Number.isFinite(weight) ||
      weight <= 0 ||
      activityMultiplier ===
        undefined ||
      goalAdjustment ===
        undefined
    ) {
      return null
    }

    const maintenanceCalories =
      weight *
      activityMultiplier

    return Math.round(
      maintenanceCalories +
        goalAdjustment
    )
  }

const validatePersonalizedInput =
  (body) => {
    const {
      primaryGoal,
      currentWeight,
      targetWeight,
      activityLevel,
      dietaryPreferences,
      foodRestrictions
    } = body

    if (
      !primaryGoal ||
      currentWeight ===
        undefined ||
      currentWeight === '' ||
      targetWeight ===
        undefined ||
      targetWeight === '' ||
      !activityLevel ||
      !dietaryPreferences?.trim() ||
      !foodRestrictions?.trim()
    ) {
      return (
        'All personalized plan fields are required'
      )
    }

    if (
      !Object.prototype
        .hasOwnProperty.call(
          goalAdjustments,
          primaryGoal
        )
    ) {
      return (
        'Please select a valid primary goal'
      )
    }

    if (
      !Object.prototype
        .hasOwnProperty.call(
          activityMultipliers,
          activityLevel
        )
    ) {
      return (
        'Please select a valid activity level'
      )
    }

    const numericCurrentWeight =
      Number(currentWeight)

    const numericTargetWeight =
      Number(targetWeight)

    if (
      !Number.isFinite(
        numericCurrentWeight
      ) ||
      numericCurrentWeight <= 0
    ) {
      return (
        'Current weight must be a valid number greater than zero'
      )
    }

    if (
      !Number.isFinite(
        numericTargetWeight
      ) ||
      numericTargetWeight <= 0
    ) {
      return (
        'Target weight must be a valid number greater than zero'
      )
    }

    return null
  }

const calculatePersonalizedPlan =
  (body) => {
    const currentWeight =
      Number(
        body.currentWeight
      )

    const targetWeight =
      Number(
        body.targetWeight
      )

    const activityMultiplier =
      activityMultipliers[
        body.activityLevel
      ]

    const goalAdjustment =
      goalAdjustments[
        body.primaryGoal
      ]

    const maintenanceCalories =
      currentWeight *
      activityMultiplier

    const calorieTarget =
      Math.round(
        maintenanceCalories +
          goalAdjustment
      )

    /*
      Personalized plans use the
      project's approved 30/40/30
      macro calculation.
    */

    const macroTargets =
      calculateMacros(
        calorieTarget,
        {
          protein: 0.30,
          carbs: 0.40,
          fat: 0.30
        }
      )

    return {
      planName:
        `${body.primaryGoal} Personalized Plan`,

      description:
        `A personalized nutrition plan built for ${body.primaryGoal.toLowerCase()} using your current weight and activity level.`,

      primaryGoal:
        body.primaryGoal,

      currentWeight,

      targetWeight,

      activityLevel:
        body.activityLevel,

      dietaryPreferences:
        body
          .dietaryPreferences
          .trim(),

      foodRestrictions:
        body
          .foodRestrictions
          .trim(),

      maintenanceCalories:
        Math.round(
          maintenanceCalories
        ),

      calorieTarget,

      proteinTarget:
        macroTargets
          .proteinTarget,

      carbTarget:
        macroTargets
          .carbTarget,

      fatTarget:
        macroTargets
          .fatTarget
    }
  }

const getPresetDiets = (
  req,
  res
) => {
  return res.status(200).json({
    success: true,
    presets: presetDiets
  })
}

const getActiveDiet = async (
  req,
  res
) => {
  try {
    const plan =
      await DietPlan.findByUserId(
        req.user.userId
      )

    return res.status(200).json({
      success: true,
      plan:
        plan || null
    })
  } catch (error) {
    console.error(
      'Get active diet error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to retrieve diet plan'
    })
  }
}

const saveDiet = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId

    const {
      presetKey
    } = req.body

    if (!presetKey) {
      return res.status(400).json({
        success: false,
        message:
          'A diet plan must be selected'
      })
    }

    const preset =
      presetDiets.find(
        (plan) =>
          plan.key ===
          presetKey
      )

    if (!preset) {
      return res.status(400).json({
        success: false,
        message:
          'The selected diet plan is invalid'
      })
    }

    /*
      Pull the user's profile so
      preset calories can be
      personalized when possible.
    */

    const profile =
      await Profile.findByUserId(
        userId
      )

    let calorieTarget =
      calculateCaloriesFromProfile(
        profile
      )

    /*
      If the profile is incomplete,
      preserve an existing calorie
      target when one exists.
    */

    if (!calorieTarget) {
      const existingGoals =
        await NutritionGoal
          .findByUserId(
            userId
          )

      const existingCalories =
        Number(
          existingGoals
            ?.calorie_goal
        )

      if (
        Number.isFinite(
          existingCalories
        ) &&
        existingCalories > 0
      ) {
        calorieTarget =
          existingCalories
      }
    }

    /*
      A new account may not have a
      profile or nutrition goals yet.

      The preset still needs to be
      applicable, so HealthFusion uses
      a starter baseline. Saving a
      profile later can personalize
      the targets.
    */

    if (!calorieTarget) {
      calorieTarget =
        DEFAULT_PRESET_CALORIES
    }

    const macroTargets =
      calculateMacros(
        calorieTarget,
        preset.macroSplit
      )

    const planData = {
      primaryGoal:
        profile
          ?.health_goal ||
        null,

      currentWeight:
        profile?.weight ||
        null,

      targetWeight:
        profile
          ?.target_weight ||
        null,

      activityLevel:
        profile
          ?.activity_level ||
        null,

      dietaryPreferences:
        profile
          ?.dietary_preferences ||
        null,

      foodRestrictions:
        profile
          ?.food_restrictions ||
        null,

      calorieTarget,

      proteinTarget:
        macroTargets
          .proteinTarget,

      carbTarget:
        macroTargets
          .carbTarget,

      fatTarget:
        macroTargets
          .fatTarget
    }

    /*
      Save the actual selected diet.
    */

    const plan =
      await DietPlan.savePreset(
        userId,
        preset,
        planData
      )

    /*
      THIS is the connection to
      User Progress.

      User Progress reads the
      Nutrition_Goals table, so the
      chosen preset's calculated
      targets are written there too.
    */

    const goals =
      await NutritionGoal.save(
        userId,
        calorieTarget,
        macroTargets
          .proteinTarget,
        macroTargets
          .carbTarget,
        macroTargets
          .fatTarget
      )

    return res.status(200).json({
      success: true,

      message:
        'Diet plan applied and nutrition targets updated successfully',

      plan,
      goals
    })
  } catch (error) {
    console.error(
      'Save diet error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to save diet plan'
    })
  }
}

const previewPersonalizedDiet =
  async (
    req,
    res
  ) => {
    try {
      const validationError =
        validatePersonalizedInput(
          req.body
        )

      if (validationError) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              validationError
          })
      }

      const plan =
        calculatePersonalizedPlan(
          req.body
        )

      return res.status(200).json({
        success: true,

        message:
          'Personalized plan calculated successfully',

        plan
      })
    } catch (error) {
      console.error(
        'Preview personalized diet error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to calculate personalized plan'
      })
    }
  }

const savePersonalizedDiet =
  async (
    req,
    res
  ) => {
    try {
      const validationError =
        validatePersonalizedInput(
          req.body
        )

      if (validationError) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              validationError
          })
      }

      /*
        Recalculate on the server
        before saving.
      */

      const calculatedPlan =
        calculatePersonalizedPlan(
          req.body
        )

      const plan =
        await DietPlan
          .savePersonalized(
            req.user.userId,
            calculatedPlan
          )

      /*
        Personalized plans already
        feed their targets directly
        into User Progress.
      */

      const goals =
        await NutritionGoal.save(
          req.user.userId,
          calculatedPlan
            .calorieTarget,
          calculatedPlan
            .proteinTarget,
          calculatedPlan
            .carbTarget,
          calculatedPlan
            .fatTarget
        )

      return res.status(200).json({
        success: true,

        message:
          'Personalized diet plan saved and nutrition targets updated successfully',

        plan,
        goals
      })
    } catch (error) {
      console.error(
        'Save personalized diet error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to save personalized plan'
      })
    }
  }

module.exports = {
  getPresetDiets,
  getActiveDiet,
  saveDiet,
  previewPersonalizedDiet,
  savePersonalizedDiet
}
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

/*
  Default macro split used by
  personalized plans and users
  without an active preset plan.
*/
const defaultMacroSplit = {
  protein: 0.30,
  carbs: 0.40,
  fat: 0.30
}

/*
  Macro splits used by each
  Discovery preset plan.
*/
const presetMacroSplits = {
  balanced: {
    protein: 0.30,
    carbs: 0.40,
    fat: 0.30
  },

  'high-protein': {
    protein: 0.40,
    carbs: 0.35,
    fat: 0.25
  },

  mediterranean: {
    protein: 0.25,
    carbs: 0.45,
    fat: 0.30
  },

  'lower-carb': {
    protein: 0.35,
    carbs: 0.25,
    fat: 0.40
  }
}

const roundOneDecimal = value => {
  return Math.round(value * 10) / 10
}

const calculateMacros = (
  calorieTarget,
  macroSplit = defaultMacroSplit
) => {
  const proteinTarget =
    roundOneDecimal(
      (calorieTarget *
        macroSplit.protein) /
        4
    )

  const carbTarget =
    roundOneDecimal(
      (calorieTarget *
        macroSplit.carbs) /
        4
    )

  const fatTarget =
    roundOneDecimal(
      (calorieTarget *
        macroSplit.fat) /
        9
    )

  return {
    proteinTarget,
    carbTarget,
    fatTarget
  }
}

const calculateNutritionTargets = (
  currentWeight,
  activityLevel,
  healthGoal,
  macroSplit = defaultMacroSplit
) => {
  const numericWeight =
    Number(currentWeight)

  const activityMultiplier =
    activityMultipliers[
      activityLevel
    ]

  const goalAdjustment =
    goalAdjustments[
      healthGoal
    ]

  if (
    !Number.isFinite(
      numericWeight
    ) ||
    numericWeight <= 0
  ) {
    throw new Error(
      'A valid current weight is required to calculate nutrition targets'
    )
  }

  if (
    activityMultiplier ===
    undefined
  ) {
    throw new Error(
      'A valid activity level is required to calculate nutrition targets'
    )
  }

  if (
    goalAdjustment ===
    undefined
  ) {
    throw new Error(
      'A valid health goal is required to calculate nutrition targets'
    )
  }

  const maintenanceCalories =
    numericWeight *
    activityMultiplier

  const calorieTarget =
    Math.round(
      maintenanceCalories +
        goalAdjustment
    )

  const macroTargets =
    calculateMacros(
      calorieTarget,
      macroSplit
    )

  return {
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

module.exports = {
  activityMultipliers,
  goalAdjustments,
  defaultMacroSplit,
  presetMacroSplits,
  calculateMacros,
  calculateNutritionTargets
}

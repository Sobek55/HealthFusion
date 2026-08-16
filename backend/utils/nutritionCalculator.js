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

const roundOneDecimal = value => {
  return Math.round(value * 10) / 10
}

const calculateNutritionTargets = (
  currentWeight,
  activityLevel,
  healthGoal
) => {
  const numericWeight = Number(currentWeight)

  const activityMultiplier =
    activityMultipliers[activityLevel]

  const goalAdjustment =
    goalAdjustments[healthGoal]

  if (
    !Number.isFinite(numericWeight) ||
    numericWeight <= 0
  ) {
    throw new Error(
      'A valid current weight is required to calculate nutrition targets'
    )
  }

  if (activityMultiplier === undefined) {
    throw new Error(
      'A valid activity level is required to calculate nutrition targets'
    )
  }

  if (goalAdjustment === undefined) {
    throw new Error(
      'A valid health goal is required to calculate nutrition targets'
    )
  }

  const maintenanceCalories =
    numericWeight * activityMultiplier

  const calorieTarget =
    Math.round(
      maintenanceCalories + goalAdjustment
    )

  const proteinTarget =
    roundOneDecimal(
      (calorieTarget * 0.30) / 4
    )

  const carbTarget =
    roundOneDecimal(
      (calorieTarget * 0.40) / 4
    )

  const fatTarget =
    roundOneDecimal(
      (calorieTarget * 0.30) / 9
    )

  return {
    maintenanceCalories:
      Math.round(maintenanceCalories),

    calorieTarget,
    proteinTarget,
    carbTarget,
    fatTarget
  }
}

module.exports = {
  activityMultipliers,
  goalAdjustments,
  calculateNutritionTargets
}
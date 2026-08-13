const NutritionGoal = require('../models/NutritionGoal')

const getGoals = async (req, res) => {
  try {
    const goals = await NutritionGoal.findByUserId(
      req.user.userId
    )

    res.status(200).json({
      goals: goals || null
    })
  } catch (error) {
    console.error('Get nutrition goals error:', error)

    res.status(500).json({
      message: 'Unable to retrieve nutrition goals'
    })
  }
}

const saveGoals = async (req, res) => {
  try {
    const {
      calorieGoal,
      proteinGoal,
      carbGoal,
      fatGoal
    } = req.body

    const calories = Number(calorieGoal)
    const protein = Number(proteinGoal)
    const carbs = Number(carbGoal)
    const fat = Number(fatGoal)

    if (
      !Number.isFinite(calories) ||
      !Number.isFinite(protein) ||
      !Number.isFinite(carbs) ||
      !Number.isFinite(fat)
    ) {
      return res.status(400).json({
        message: 'All nutrition goals must be valid numbers'
      })
    }

    if (
      calories <= 0 ||
      protein < 0 ||
      carbs < 0 ||
      fat < 0
    ) {
      return res.status(400).json({
        message: 'Nutrition goals cannot contain invalid negative values'
      })
    }

    const goals = await NutritionGoal.save(
      req.user.userId,
      calories,
      protein,
      carbs,
      fat
    )

    res.status(200).json({
      message: 'Nutrition goals saved successfully',
      goals
    })
  } catch (error) {
    console.error('Save nutrition goals error:', error)

    res.status(500).json({
      message: 'Unable to save nutrition goals'
    })
  }
}

module.exports = {
  getGoals,
  saveGoals
}
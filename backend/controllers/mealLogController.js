const Meal = require('../models/Meal')
const MealLog = require('../models/MealLog')

const logMeal = async (req, res) => {
  try {
    const userId = req.user.userId
    const mealId = Number(req.params.mealId)

    const meal = await Meal.findById(
      mealId,
      userId
    )

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      })
    }

    const logId = await MealLog.create(
      userId,
      mealId
    )

    const mealLog = await MealLog.findById(
      logId,
      userId
    )

    return res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      mealLog
    })
  } catch (error) {
    console.error('Meal logging error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to log meal'
    })
  }
}

const getMealLogs = async (req, res) => {
  try {
    const userId = req.user.userId

    const logs = await MealLog.findAllByUser(
      userId
    )

    return res.status(200).json({
      success: true,
      logs
    })
  } catch (error) {
    console.error('Get meal logs error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve meal logs'
    })
  }
}

const getTodayMealLogs = async (req, res) => {
  try {
    const userId = req.user.userId

    const logs = await MealLog.findTodayByUser(
      userId
    )

    return res.status(200).json({
      success: true,
      logs
    })
  } catch (error) {
    console.error(
      'Get today meal logs error:',
      error
    )

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve today meal logs'
    })
  }
}

const deleteMealLog = async (req, res) => {
  try {
    const userId = req.user.userId
    const logId = Number(req.params.logId)

    const deleted = await MealLog.delete(
      logId,
      userId
    )

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Meal log not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Meal log deleted successfully'
    })
  } catch (error) {
    console.error(
      'Meal log deletion error:',
      error
    )

    return res.status(500).json({
      success: false,
      message: 'Unable to delete meal log'
    })
  }
}

module.exports = {
  logMeal,
  getMealLogs,
  getTodayMealLogs,
  deleteMealLog
}
const Meal = require('../models/Meal')
const Food = require('../models/Food')

const validateItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 'A meal must contain at least one food'
  }

  for (const item of items) {
    const foodId = Number(item.foodId)
    const quantity = Number(item.quantity)

    if (
      !Number.isInteger(foodId) ||
      foodId <= 0
    ) {
      return 'Every meal item requires a valid food'
    }

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return 'Every meal item requires a valid quantity greater than zero'
    }

    const food = await Food.findById(foodId)

    if (!food) {
      return `Food ${foodId} was not found`
    }
  }

  return null
}

const getMeals = async (req, res) => {
  try {
    const meals = await Meal.findAllByUser(
      req.user.userId
    )

    return res.status(200).json({
      success: true,
      meals
    })
  } catch (error) {
    console.error('Get meals error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve meals'
    })
  }
}

const createMeal = async (req, res) => {
  try {
    const userId = req.user.userId
    const { mealName, items } = req.body

    if (!mealName || !mealName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Meal name is required'
      })
    }

    const itemError = await validateItems(items)

    if (itemError) {
      return res.status(400).json({
        success: false,
        message: itemError
      })
    }

    const mealId = await Meal.createWithItems(
      userId,
      mealName.trim(),
      items
    )

    const meal = await Meal.findById(
      mealId,
      userId
    )

    return res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      meal
    })
  } catch (error) {
    console.error('Meal creation error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create meal'
    })
  }
}

const updateMeal = async (req, res) => {
  try {
    const userId = req.user.userId
    const mealId = Number(req.params.mealId)

    const { mealName, items } = req.body

    if (!mealName || !mealName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Meal name is required'
      })
    }

    const itemError = await validateItems(items)

    if (itemError) {
      return res.status(400).json({
        success: false,
        message: itemError
      })
    }

    const updated = await Meal.updateWithItems(
      userId,
      mealId,
      mealName.trim(),
      items
    )

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      })
    }

    const meal = await Meal.findById(
      mealId,
      userId
    )

    return res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      meal
    })
  } catch (error) {
    console.error('Meal update error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update meal'
    })
  }
}

const deleteMeal = async (req, res) => {
  try {
    const userId = req.user.userId
    const mealId = Number(req.params.mealId)

    const deleted = await Meal.delete(
      mealId,
      userId
    )

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Meal deleted successfully'
    })
  } catch (error) {
    console.error('Meal deletion error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete meal'
    })
  }
}

const getMeal = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      meal
    })
  } catch (error) {
    console.error('Get meal error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve meal'
    })
  }
}

module.exports = {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal
}
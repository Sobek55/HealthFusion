const Meal = require('../models/Meal')
const Food = require('../models/Food')

const createMeal = async (req, res) => {
  try {
    const userId = req.user.userId

    const {
      mealName,
      items
    } = req.body

    if (!mealName || !mealName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Meal name is required'
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A meal must contain at least one food'
      })
    }

    for (const item of items) {
      if (
        !item.foodId ||
        !item.quantity ||
        Number(item.quantity) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Every meal item requires a valid food and quantity'
        })
      }

      const food = await Food.findById(item.foodId)

      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food ${item.foodId} was not found`
        })
      }
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

module.exports = {
  createMeal
}
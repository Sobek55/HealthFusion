const Meal =
  require('../models/Meal')

const Food =
  require('../models/Food')

const mealTypes = [
  'Breakfast',
  'Brunch',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
  'Pre-Workout',
  'Post-Workout',
  'Shake/Drink'
]

const validateItems = async (
  items,
  userId
) => {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return (
      'A meal must contain at least one food'
    )
  }

  for (const item of items) {
    const foodId =
      Number(item.foodId)

    const quantity =
      Number(item.quantity)

    if (
      !Number.isInteger(
        foodId
      ) ||
      foodId <= 0
    ) {
      return (
        'Every meal item requires a valid food'
      )
    }

    if (
      !Number.isFinite(
        quantity
      ) ||
      quantity <= 0
    ) {
      return (
        'Every meal item requires a valid quantity greater than zero'
      )
    }

    const food =
      await Food.findById(
        foodId,
        userId
      )

    if (!food) {
      return (
        `Food ${foodId} was not found`
      )
    }
  }

  return null
}

const validateMealBasics = (
  mealName,
  mealType,
  mealDate
) => {
  if (
    !mealName ||
    !mealName.trim()
  ) {
    return (
      'Meal name is required'
    )
  }

  if (
    !mealTypes.includes(
      mealType
    )
  ) {
    return (
      'Please select a valid meal type'
    )
  }

  if (!mealDate) {
    return (
      'Meal date is required'
    )
  }

  const datePattern =
    /^\d{4}-\d{2}-\d{2}$/

  if (
    !datePattern.test(
      mealDate
    )
  ) {
    return (
      'Meal date must use YYYY-MM-DD format'
    )
  }

  return null
}

const validateManualMeal = (
  servingSize,
  calories,
  protein,
  carbs,
  fat
) => {
  const numericServingSize =
    Number(servingSize)

  if (
    !Number.isFinite(
      numericServingSize
    ) ||
    numericServingSize <= 0
  ) {
    return (
      'Serving size must be greater than zero'
    )
  }

  const nutrients = {
    Calories: calories,
    Protein: protein,
    Carbohydrates: carbs,
    Fat: fat
  }

  for (
    const [name, value]
    of Object.entries(
      nutrients
    )
  ) {
    if (
      value === '' ||
      value === null ||
      value === undefined
    ) {
      return (
        `${name} is required`
      )
    }

    const numericValue =
      Number(value)

    if (
      !Number.isFinite(
        numericValue
      ) ||
      numericValue < 0
    ) {
      return (
        `${name} cannot be negative`
      )
    }
  }

  return null
}

const getMeals = async (
  req,
  res
) => {
  try {
    const meals =
      await Meal.findAllByUser(
        req.user.userId
      )

    return res.status(200).json({
      success: true,
      meals
    })
  } catch (error) {
    console.error(
      'Get meals error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to retrieve meals'
    })
  }
}

const getMeal = async (
  req,
  res
) => {
  try {
    const meal =
      await Meal.findById(
        Number(
          req.params.mealId
        ),
        req.user.userId
      )

    if (!meal) {
      return res.status(404).json({
        success: false,
        message:
          'Meal not found'
      })
    }

    return res.status(200).json({
      success: true,
      meal
    })
  } catch (error) {
    console.error(
      'Get meal error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to retrieve meal'
    })
  }
}

const createMeal = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId

    const {
      entryMode = 'builder',
      mealName,
      mealType,
      mealDate,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat,
      items
    } = req.body

    const basicError =
      validateMealBasics(
        mealName,
        mealType,
        mealDate
      )

    if (basicError) {
      return res.status(400).json({
        success: false,
        message:
          basicError
      })
    }

    let mealId

    if (
      entryMode === 'manual'
    ) {
      const manualError =
        validateManualMeal(
          servingSize,
          calories,
          protein,
          carbs,
          fat
        )

      if (manualError) {
        return res.status(400).json({
          success: false,
          message:
            manualError
        })
      }

      mealId =
        await Meal.createManual(
          userId,
          {
            mealName:
              mealName.trim(),

            mealType,
            mealDate,

            servingSize:
              Number(
                servingSize
              ),

            servingUnit:
              servingUnit
                ?.trim() ||
              'serving',

            calories:
              Number(calories),

            protein:
              Number(protein),

            carbs:
              Number(carbs),

            fat:
              Number(fat)
          }
        )
    } else if (
      entryMode === 'builder'
    ) {
      const itemError =
        await validateItems(
          items,
          userId
        )

      if (itemError) {
        return res.status(400).json({
          success: false,
          message:
            itemError
        })
      }

      mealId =
        await Meal.createWithItems(
          userId,
          mealName.trim(),
          mealType,
          mealDate,
          items
        )
    } else {
      return res.status(400).json({
        success: false,
        message:
          'Invalid meal entry mode'
      })
    }

    const meal =
      await Meal.findById(
        mealId,
        userId
      )

    return res.status(201).json({
      success: true,
      message:
        'Meal created successfully',
      meal
    })
  } catch (error) {
    console.error(
      'Meal creation error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to create meal'
    })
  }
}

const updateMeal = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId

    const mealId =
      Number(
        req.params.mealId
      )

    const {
      entryMode = 'builder',
      mealName,
      mealType,
      mealDate,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat,
      items
    } = req.body

    const basicError =
      validateMealBasics(
        mealName,
        mealType,
        mealDate
      )

    if (basicError) {
      return res.status(400).json({
        success: false,
        message:
          basicError
      })
    }

    let updated

    if (
      entryMode === 'manual'
    ) {
      const manualError =
        validateManualMeal(
          servingSize,
          calories,
          protein,
          carbs,
          fat
        )

      if (manualError) {
        return res.status(400).json({
          success: false,
          message:
            manualError
        })
      }

      updated =
        await Meal.updateManual(
          userId,
          mealId,
          {
            mealName:
              mealName.trim(),

            mealType,
            mealDate,

            servingSize:
              Number(
                servingSize
              ),

            servingUnit:
              servingUnit
                ?.trim() ||
              'serving',

            calories:
              Number(calories),

            protein:
              Number(protein),

            carbs:
              Number(carbs),

            fat:
              Number(fat)
          }
        )
    } else if (
      entryMode === 'builder'
    ) {
      const itemError =
        await validateItems(
          items,
          userId
        )

      if (itemError) {
        return res.status(400).json({
          success: false,
          message:
            itemError
        })
      }

      updated =
        await Meal.updateWithItems(
          userId,
          mealId,
          mealName.trim(),
          mealType,
          mealDate,
          items
        )
    } else {
      return res.status(400).json({
        success: false,
        message:
          'Invalid meal entry mode'
      })
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message:
          'Meal not found'
      })
    }

    const meal =
      await Meal.findById(
        mealId,
        userId
      )

    return res.status(200).json({
      success: true,
      message:
        'Meal updated successfully',
      meal
    })
  } catch (error) {
    console.error(
      'Meal update error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to update meal'
    })
  }
}

const deleteMeal = async (
  req,
  res
) => {
  try {
    const deleted =
      await Meal.delete(
        Number(
          req.params.mealId
        ),
        req.user.userId
      )

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message:
          'Meal not found'
      })
    }

    return res.status(200).json({
      success: true,
      message:
        'Meal deleted successfully'
    })
  } catch (error) {
    console.error(
      'Meal deletion error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to delete meal'
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
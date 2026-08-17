const Food =
  require('../models/Food')

const FOOD_CATEGORIES = [
  'Protein',
  'Carbs',
  'Fruit',
  'Vegetables',
  'Dairy',
  'Fats',
  'Snacks',
  'Drinks'
]

const getFoods = async (
  req,
  res
) => {
  try {
    const searchTerm =
      req.query.search?.trim()

    const requestedCategory =
      req.query.category?.trim()

    const category =
      requestedCategory &&
      requestedCategory !== 'All'
        ? requestedCategory
        : null

    if (
      category &&
      !FOOD_CATEGORIES.includes(
        category
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid food category'
      })
    }

    let foods

    if (searchTerm) {
      foods =
        await Food.search(
          req.user.userId,
          searchTerm,
          category
        )
    } else {
      foods =
        await Food.findAll(
          req.user.userId,
          category
        )
    }

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods
    })
  } catch (error) {
    console.error(
      'Food search error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to retrieve foods'
    })
  }
}

const createFood = async (
  req,
  res
) => {
  try {
    const {
      name,
      category,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat
    } = req.body

    if (
      !name ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Food name is required'
      })
    }

    if (
      !FOOD_CATEGORIES.includes(
        category
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please select a valid food category'
      })
    }

    const numericServingSize =
      Number(servingSize)

    if (
      !Number.isFinite(
        numericServingSize
      ) ||
      numericServingSize <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Serving size must be greater than zero'
      })
    }

    if (
      !servingUnit ||
      !servingUnit.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Serving unit is required'
      })
    }

    const nutrition = {
      Calories: calories,
      Protein: protein,
      Carbohydrates: carbs,
      Fat: fat
    }

    const normalized = {}

    for (
      const [key, value]
      of Object.entries(
        nutrition
      )
    ) {
      if (
        value === '' ||
        value === null ||
        value === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${key} is required`
        })
      }

      const numeric =
        Number(value)

      if (
        !Number.isFinite(
          numeric
        ) ||
        numeric < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${key} must be zero or greater`
        })
      }

      normalized[key] =
        numeric
    }

    const food =
      await Food.create(
        req.user.userId,
        {
          name:
            name.trim(),

          category,

          servingSize:
            numericServingSize,

          servingUnit:
            servingUnit.trim(),

          calories:
            normalized.Calories,

          protein:
            normalized.Protein,

          carbs:
            normalized.Carbohydrates,

          fat:
            normalized.Fat
        }
      )

    return res.status(201).json({
      success: true,
      message:
        'Custom food created successfully',
      food
    })
  } catch (error) {
    console.error(
      'Create food error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to create custom food'
    })
  }
}

module.exports = {
  getFoods,
  createFood
}
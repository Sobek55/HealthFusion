const DietPlan = require('../models/DietPlan')

const presetDiets = [
  {
    key: 'balanced',
    name: 'Balanced Nutrition',
    description:
      'A flexible plan focused on balanced meals and consistent nutrition.',
    focus:
      'Balanced intake of protein, carbohydrates, fats, fruits, and vegetables.',
    suitableFor:
      'General wellness, weight maintenance, and users looking for a flexible approach.',
    guidelines: [
      'Include a protein source with each main meal.',
      'Choose fruits and vegetables throughout the day.',
      'Use whole-food carbohydrate sources when possible.',
      'Include moderate amounts of healthy fats.'
    ]
  },

  {
    key: 'high-protein',
    name: 'High Protein',
    description:
      'A protein-focused plan designed to support muscle development and recovery.',
    focus:
      'Higher protein intake while maintaining balanced carbohydrate and fat intake.',
    suitableFor:
      'Active users, resistance training, and muscle-focused goals.',
    guidelines: [
      'Prioritize lean protein sources.',
      'Distribute protein throughout the day.',
      'Include carbohydrates around activity.',
      'Maintain adequate fruit and vegetable intake.'
    ]
  },

  {
    key: 'mediterranean',
    name: 'Mediterranean',
    description:
      'A whole-food plan emphasizing vegetables, fruits, grains, seafood, and healthy fats.',
    focus:
      'Whole foods and plant-forward meals with moderate lean protein.',
    suitableFor:
      'Users seeking a flexible whole-food eating pattern.',
    guidelines: [
      'Emphasize vegetables and fruits.',
      'Choose whole grains and legumes.',
      'Use foods such as olive oil, nuts, and seeds for fats.',
      'Include fish and other lean protein sources.'
    ]
  },

  {
    key: 'lower-carb',
    name: 'Lower Carbohydrate',
    description:
      'A plan that reduces carbohydrate intake while emphasizing protein, vegetables, and fats.',
    focus:
      'Moderate carbohydrate intake with greater emphasis on protein and non-starchy vegetables.',
    suitableFor:
      'Users who prefer meals with fewer carbohydrate-heavy foods.',
    guidelines: [
      'Prioritize protein at each meal.',
      'Choose non-starchy vegetables frequently.',
      'Use moderate portions of carbohydrate foods.',
      'Include healthy fat sources.'
    ]
  }
]

const getPresetDiets = (req, res) => {
  return res.status(200).json({
    success: true,
    presets: presetDiets
  })
}

const getActiveDiet = async (req, res) => {
  try {
    const plan =
      await DietPlan.findByUserId(req.user.userId)

    return res.status(200).json({
      success: true,
      plan: plan || null
    })
  } catch (error) {
    console.error('Get active diet error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve diet plan'
    })
  }
}

const saveDiet = async (req, res) => {
  try {
    const { presetKey } = req.body

    if (!presetKey) {
      return res.status(400).json({
        success: false,
        message: 'A diet plan must be selected'
      })
    }

    const preset = presetDiets.find(
      plan => plan.key === presetKey
    )

    if (!preset) {
      return res.status(400).json({
        success: false,
        message: 'The selected diet plan is invalid'
      })
    }

    const plan = await DietPlan.savePreset(
      req.user.userId,
      preset
    )

    return res.status(200).json({
      success: true,
      message: 'Diet plan applied successfully',
      plan
    })
  } catch (error) {
    console.error('Save diet error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to save diet plan'
    })
  }
}

module.exports = {
  getPresetDiets,
  getActiveDiet,
  saveDiet
}
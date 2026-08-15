const Food = require('../models/Food')

const getFoods = async (req, res) => {
  try {
    const searchTerm = req.query.search?.trim()

    let foods

    if (searchTerm) {
      foods = await Food.search(searchTerm)
    } else {
      foods = await Food.findAll()
    }

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods
    })
  } catch (error) {
    console.error('Food search error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve foods'
    })
  }
}

module.exports = {
  getFoods
}
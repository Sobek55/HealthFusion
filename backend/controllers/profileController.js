const Profile = require('../models/Profile')

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findByUserId(req.user.userId)

    res.status(200).json({
      profile: profile || null
    })
  } catch (error) {
    console.error('Get profile error:', error)

    res.status(500).json({
      message: 'Unable to retrieve profile'
    })
  }
}

const saveProfile = async (req, res) => {
  try {
    const {
      age,
      height,
      weight,
      activityLevel
    } = req.body

    const profile = await Profile.save(
      req.user.userId,
      age || null,
      height || null,
      weight || null,
      activityLevel || null
    )

    res.status(200).json({
      message: 'Profile saved successfully',
      profile
    })
  } catch (error) {
    console.error('Save profile error:', error)

    res.status(500).json({
      message: 'Unable to save profile'
    })
  }
}

module.exports = {
  getProfile,
  saveProfile
}
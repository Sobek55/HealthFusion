const pool = require('../config/db')

const Profile = {
  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT
        profile_id,
        user_id,
        age,
        height,
        weight,
        activity_level
       FROM User_Profiles
       WHERE user_id = ?`,
      [userId]
    )

    return rows[0]
  },

  async save(userId, age, height, weight, activityLevel) {
    await pool.execute(
      `INSERT INTO User_Profiles
        (user_id, age, height, weight, activity_level)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        age = VALUES(age),
        height = VALUES(height),
        weight = VALUES(weight),
        activity_level = VALUES(activity_level)`,
      [userId, age, height, weight, activityLevel]
    )

    return this.findByUserId(userId)
  }
}

module.exports = Profile
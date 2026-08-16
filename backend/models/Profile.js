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
        target_weight,
        health_goal,
        activity_level,
        dietary_preferences,
        food_restrictions
       FROM User_Profiles
       WHERE user_id = ?`,
      [userId]
    )

    return rows[0]
  },

  async save(
    userId,
    age,
    height,
    weight,
    targetWeight,
    healthGoal,
    activityLevel,
    dietaryPreferences,
    foodRestrictions
  ) {
    await pool.execute(
      `INSERT INTO User_Profiles
        (
          user_id,
          age,
          height,
          weight,
          target_weight,
          health_goal,
          activity_level,
          dietary_preferences,
          food_restrictions
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
          age = VALUES(age),
          height = VALUES(height),
          weight = VALUES(weight),
          target_weight =
            VALUES(target_weight),
          health_goal =
            VALUES(health_goal),
          activity_level =
            VALUES(activity_level),
          dietary_preferences =
            VALUES(dietary_preferences),
          food_restrictions =
            VALUES(food_restrictions)`,
      [
        userId,
        age,
        height,
        weight,
        targetWeight,
        healthGoal,
        activityLevel,
        dietaryPreferences,
        foodRestrictions
      ]
    )

    return this.findByUserId(userId)
  }
}

module.exports = Profile
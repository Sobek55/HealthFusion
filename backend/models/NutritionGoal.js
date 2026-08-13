const pool = require('../config/db')

const NutritionGoal = {
  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT
        goal_id,
        user_id,
        calorie_goal,
        protein_goal,
        carb_goal,
        fat_goal
       FROM Nutrition_Goals
       WHERE user_id = ?`,
      [userId]
    )

    return rows[0]
  },

  async save(
    userId,
    calorieGoal,
    proteinGoal,
    carbGoal,
    fatGoal
  ) {
    await pool.execute(
      `INSERT INTO Nutrition_Goals
        (
          user_id,
          calorie_goal,
          protein_goal,
          carb_goal,
          fat_goal
        )
       VALUES (?, ?, ?, ?, ?) AS new
       ON DUPLICATE KEY UPDATE
        calorie_goal = new.calorie_goal,
        protein_goal = new.protein_goal,
        carb_goal = new.carb_goal,
        fat_goal = new.fat_goal`,
      [
        userId,
        calorieGoal,
        proteinGoal,
        carbGoal,
        fatGoal
      ]
    )

    return this.findByUserId(userId)
  }
}

module.exports = NutritionGoal
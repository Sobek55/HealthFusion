const pool =
  require('../config/db')

const NutritionGoal = {
  async findByUserId(
    userId
  ) {
    const [rows] =
      await pool.execute(
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
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
          calorie_goal =
            VALUES(calorie_goal),
          protein_goal =
            VALUES(protein_goal),
          carb_goal =
            VALUES(carb_goal),
          fat_goal =
            VALUES(fat_goal)`,
      [
        userId,
        calorieGoal,
        proteinGoal,
        carbGoal,
        fatGoal
      ]
    )

    return this.findByUserId(
      userId
    )
  }
}

module.exports =
  NutritionGoal
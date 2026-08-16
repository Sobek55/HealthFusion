const pool = require('../config/db')

const DietPlan = {
  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT
        diet_plan_id,
        user_id,
        plan_type,
        preset_key,
        plan_name,
        description,
        primary_goal,
        current_weight,
        target_weight,
        activity_level,
        dietary_preferences,
        food_restrictions,
        calorie_target,
        protein_target,
        carb_target,
        fat_target,
        confirmed,
        created_at,
        updated_at
       FROM Diet_Plans
       WHERE user_id = ?`,
      [userId]
    )

    return rows[0]
  },

  async savePreset(userId, preset) {
    await pool.execute(
      `INSERT INTO Diet_Plans
        (
          user_id,
          plan_type,
          preset_key,
          plan_name,
          description,
          confirmed
        )
       VALUES (?, 'preset', ?, ?, ?, TRUE) AS new
       ON DUPLICATE KEY UPDATE
          plan_type = new.plan_type,
          preset_key = new.preset_key,
          plan_name = new.plan_name,
          description = new.description,

          primary_goal = NULL,
          current_weight = NULL,
          target_weight = NULL,
          activity_level = NULL,
          dietary_preferences = NULL,
          food_restrictions = NULL,

          calorie_target = NULL,
          protein_target = NULL,
          carb_target = NULL,
          fat_target = NULL,

          confirmed = TRUE`,
      [
        userId,
        preset.key,
        preset.name,
        preset.description
      ]
    )

    return this.findByUserId(userId)
  }
}

module.exports = DietPlan
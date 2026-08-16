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
       VALUES (?, 'preset', ?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE
          plan_type = VALUES(plan_type),
          preset_key = VALUES(preset_key),
          plan_name = VALUES(plan_name),
          description = VALUES(description),

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
  },

  async savePersonalized(userId, plan) {
    await pool.execute(
      `INSERT INTO Diet_Plans
        (
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
          confirmed
        )
       VALUES (
          ?,
          'personalized',
          NULL,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          TRUE
       )
       ON DUPLICATE KEY UPDATE
          plan_type = VALUES(plan_type),
          preset_key = NULL,
          plan_name = VALUES(plan_name),
          description = VALUES(description),
          primary_goal = VALUES(primary_goal),
          current_weight = VALUES(current_weight),
          target_weight = VALUES(target_weight),
          activity_level = VALUES(activity_level),
          dietary_preferences =
            VALUES(dietary_preferences),
          food_restrictions =
            VALUES(food_restrictions),
          calorie_target = VALUES(calorie_target),
          protein_target = VALUES(protein_target),
          carb_target = VALUES(carb_target),
          fat_target = VALUES(fat_target),
          confirmed = TRUE`,
      [
        userId,
        plan.planName,
        plan.description,
        plan.primaryGoal,
        plan.currentWeight,
        plan.targetWeight,
        plan.activityLevel,
        plan.dietaryPreferences,
        plan.foodRestrictions,
        plan.calorieTarget,
        plan.proteinTarget,
        plan.carbTarget,
        plan.fatTarget
      ]
    )

    return this.findByUserId(userId)
  }
}

module.exports = DietPlan
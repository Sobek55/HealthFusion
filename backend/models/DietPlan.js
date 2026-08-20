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
       WHERE user_id = ?
       ORDER BY diet_plan_id DESC
       LIMIT 1`,
      [userId]
    )

    return rows[0]
  },

  async savePreset(
    userId,
    preset,
    planData
  ) {
    const connection =
      await pool.getConnection()

    try {
      await connection.beginTransaction()

      // The active diet is one plan per user.
      // Older databases may contain duplicate rows,
      // so remove them before saving the new active plan.
      await connection.execute(
        'DELETE FROM Diet_Plans WHERE user_id = ?',
        [userId]
      )

      await connection.execute(
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
            'preset',
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
            ?,
            TRUE
         )`,
        [
          userId,
          preset.key,
          preset.name,
          preset.description,

          planData.primaryGoal,
          planData.currentWeight,
          planData.targetWeight,
          planData.activityLevel,
          planData.dietaryPreferences,
          planData.foodRestrictions,

          planData.calorieTarget,
          planData.proteinTarget,
          planData.carbTarget,
          planData.fatTarget
        ]
      )

      await connection.commit()

      return this.findByUserId(
        userId
      )
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  async savePersonalized(
    userId,
    plan
  ) {
    const connection =
      await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Keep exactly one active diet plan per user,
      // even if an older local database was created
      // without a UNIQUE constraint on user_id.
      await connection.execute(
        'DELETE FROM Diet_Plans WHERE user_id = ?',
        [userId]
      )

      await connection.execute(
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
         )`,
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

      await connection.commit()

      return this.findByUserId(
        userId
      )
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }
}

module.exports = DietPlan

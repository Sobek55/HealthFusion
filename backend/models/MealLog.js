const pool = require('../config/db')

const MealLog = {
  async create(userId, mealId) {
    const [result] = await pool.execute(
      `INSERT INTO Meal_Logs
        (user_id, meal_id)
       VALUES (?, ?)`,
      [userId, mealId]
    )

    return result.insertId
  },

  async findById(logId, userId) {
    const [rows] = await pool.execute(
      `SELECT
        ml.log_id,
        ml.user_id,
        ml.meal_id,
        ml.logged_at,
        m.meal_name
       FROM Meal_Logs ml
       JOIN Meals m
         ON ml.meal_id = m.meal_id
       WHERE ml.log_id = ?
       AND ml.user_id = ?`,
      [logId, userId]
    )

    return rows[0]
  },

  async findAllByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT
        ml.log_id,
        ml.meal_id,
        ml.logged_at,
        m.meal_name,
        COALESCE(SUM(f.calories * mi.quantity), 0) AS calories,
        COALESCE(SUM(f.protein * mi.quantity), 0) AS protein,
        COALESCE(SUM(f.carbs * mi.quantity), 0) AS carbs,
        COALESCE(SUM(f.fat * mi.quantity), 0) AS fat
       FROM Meal_Logs ml
       JOIN Meals m
         ON ml.meal_id = m.meal_id
       LEFT JOIN Meal_Items mi
         ON m.meal_id = mi.meal_id
       LEFT JOIN Foods f
         ON mi.food_id = f.food_id
       WHERE ml.user_id = ?
       GROUP BY
         ml.log_id,
         ml.meal_id,
         ml.logged_at,
         m.meal_name
       ORDER BY ml.logged_at DESC`,
      [userId]
    )

    return rows
  },

  async findTodayByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT
        ml.log_id,
        ml.meal_id,
        ml.logged_at,
        m.meal_name,
        COALESCE(SUM(f.calories * mi.quantity), 0) AS calories,
        COALESCE(SUM(f.protein * mi.quantity), 0) AS protein,
        COALESCE(SUM(f.carbs * mi.quantity), 0) AS carbs,
        COALESCE(SUM(f.fat * mi.quantity), 0) AS fat
       FROM Meal_Logs ml
       JOIN Meals m
         ON ml.meal_id = m.meal_id
       LEFT JOIN Meal_Items mi
         ON m.meal_id = mi.meal_id
       LEFT JOIN Foods f
         ON mi.food_id = f.food_id
       WHERE ml.user_id = ?
       AND DATE(ml.logged_at) = CURDATE()
       GROUP BY
         ml.log_id,
         ml.meal_id,
         ml.logged_at,
         m.meal_name
       ORDER BY ml.logged_at DESC`,
      [userId]
    )

    return rows
  },

  async delete(logId, userId) {
    const [result] = await pool.execute(
      `DELETE FROM Meal_Logs
       WHERE log_id = ?
       AND user_id = ?`,
      [logId, userId]
    )

    return result.affectedRows
  }
}

module.exports = MealLog
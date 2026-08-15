const pool = require('../config/db')

const Meal = {
  async findAllByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT
        m.meal_id,
        m.meal_name,
        m.created_at,
        COALESCE(SUM(f.calories * mi.quantity), 0) AS calories,
        COALESCE(SUM(f.protein * mi.quantity), 0) AS protein,
        COALESCE(SUM(f.carbs * mi.quantity), 0) AS carbs,
        COALESCE(SUM(f.fat * mi.quantity), 0) AS fat
       FROM Meals m
       LEFT JOIN Meal_Items mi
         ON m.meal_id = mi.meal_id
       LEFT JOIN Foods f
         ON mi.food_id = f.food_id
       WHERE m.user_id = ?
       GROUP BY
         m.meal_id,
         m.meal_name,
         m.created_at
       ORDER BY m.created_at DESC`,
      [userId]
    )

    return rows
  },

  async findById(mealId, userId) {
    const [meals] = await pool.execute(
      `SELECT
        meal_id,
        user_id,
        meal_name,
        created_at
       FROM Meals
       WHERE meal_id = ?
       AND user_id = ?`,
      [mealId, userId]
    )

    const meal = meals[0]

    if (!meal) {
      return null
    }

    const [items] = await pool.execute(
      `SELECT
        mi.meal_item_id,
        mi.food_id,
        mi.quantity,
        f.name,
        f.serving_size,
        f.serving_unit,
        f.calories,
        f.protein,
        f.carbs,
        f.fat
       FROM Meal_Items mi
       JOIN Foods f
         ON mi.food_id = f.food_id
       WHERE mi.meal_id = ?
       ORDER BY mi.meal_item_id ASC`,
      [mealId]
    )

    meal.items = items

    return meal
  },

  async create(userId, mealName) {
    const [result] = await pool.execute(
      `INSERT INTO Meals
        (user_id, meal_name)
       VALUES (?, ?)`,
      [userId, mealName]
    )

    return result.insertId
  },

  async addItem(mealId, foodId, quantity = 1) {
    const [result] = await pool.execute(
      `INSERT INTO Meal_Items
        (meal_id, food_id, quantity)
       VALUES (?, ?, ?)`,
      [mealId, foodId, quantity]
    )

    return result.insertId
  },

  async updateItem(mealItemId, quantity) {
    const [result] = await pool.execute(
      `UPDATE Meal_Items
       SET quantity = ?
       WHERE meal_item_id = ?`,
      [quantity, mealItemId]
    )

    return result.affectedRows
  },

  async removeItem(mealItemId) {
    const [result] = await pool.execute(
      `DELETE FROM Meal_Items
       WHERE meal_item_id = ?`,
      [mealItemId]
    )

    return result.affectedRows
  },

  async updateName(mealId, userId, mealName) {
    const [result] = await pool.execute(
      `UPDATE Meals
       SET meal_name = ?
       WHERE meal_id = ?
       AND user_id = ?`,
      [mealName, mealId, userId]
    )

    return result.affectedRows
  },

  async delete(mealId, userId) {
    const [result] = await pool.execute(
      `DELETE FROM Meals
       WHERE meal_id = ?
       AND user_id = ?`,
      [mealId, userId]
    )

    return result.affectedRows
  }
}

module.exports = Meal
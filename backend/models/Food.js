const pool = require('../config/db')

const Food = {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT
        food_id,
        name,
        serving_size,
        serving_unit,
        calories,
        protein,
        carbs,
        fat
       FROM Foods
       ORDER BY name ASC`
    )

    return rows
  },

  async findById(foodId) {
    const [rows] = await pool.execute(
      `SELECT
        food_id,
        name,
        serving_size,
        serving_unit,
        calories,
        protein,
        carbs,
        fat
       FROM Foods
       WHERE food_id = ?`,
      [foodId]
    )

    return rows[0]
  },

  async search(searchTerm) {
    const [rows] = await pool.execute(
      `SELECT
        food_id,
        name,
        serving_size,
        serving_unit,
        calories,
        protein,
        carbs,
        fat
       FROM Foods
       WHERE name LIKE ?
       ORDER BY name ASC`,
      [`%${searchTerm}%`]
    )

    return rows
  },

  async create(foodData) {
    const {
      name,
      servingSize,
      servingUnit,
      calories,
      protein = 0,
      carbs = 0,
      fat = 0
    } = foodData

    const [result] = await pool.execute(
      `INSERT INTO Foods
        (
          name,
          serving_size,
          serving_unit,
          calories,
          protein,
          carbs,
          fat
        )
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        servingSize,
        servingUnit,
        calories,
        protein,
        carbs,
        fat
      ]
    )

    return result.insertId
  },

  async update(foodId, foodData) {
    const {
      name,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat
    } = foodData

    const [result] = await pool.execute(
      `UPDATE Foods
       SET
         name = ?,
         serving_size = ?,
         serving_unit = ?,
         calories = ?,
         protein = ?,
         carbs = ?,
         fat = ?
       WHERE food_id = ?`,
      [
        name,
        servingSize,
        servingUnit,
        calories,
        protein,
        carbs,
        fat,
        foodId
      ]
    )

    return result.affectedRows
  },

  async delete(foodId) {
    const [result] = await pool.execute(
      'DELETE FROM Foods WHERE food_id = ?',
      [foodId]
    )

    return result.affectedRows
  }
}

module.exports = Food
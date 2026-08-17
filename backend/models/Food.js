const pool = require('../config/db')

const Food = {
  async findAll(userId, category = null) {
    let query = `
      SELECT
        food_id,
        created_by_user_id,
        name,
        category,
        serving_size,
        serving_unit,
        calories,
        protein,
        carbs,
        fat,
        CASE
          WHEN created_by_user_id IS NULL
          THEN 0
          ELSE 1
        END AS is_custom
      FROM Foods
      WHERE (
        created_by_user_id IS NULL
        OR created_by_user_id = ?
      )
    `

    const params = [userId]

    if (category) {
      query += `
        AND category = ?
      `

      params.push(category)
    }

    query += `
      ORDER BY
        category ASC,
        name ASC
    `

    const [rows] =
      await pool.execute(
        query,
        params
      )

    return rows
  },

  async findById(
    foodId,
    userId
  ) {
    const [rows] =
      await pool.execute(
        `SELECT
          food_id,
          created_by_user_id,
          name,
          category,
          serving_size,
          serving_unit,
          calories,
          protein,
          carbs,
          fat,
          CASE
            WHEN created_by_user_id IS NULL
            THEN 0
            ELSE 1
          END AS is_custom
         FROM Foods
         WHERE food_id = ?
         AND (
           created_by_user_id IS NULL
           OR created_by_user_id = ?
         )`,
        [
          foodId,
          userId
        ]
      )

    return rows[0]
  },

  async search(
    userId,
    searchTerm,
    category = null
  ) {
    let query = `
      SELECT
        food_id,
        created_by_user_id,
        name,
        category,
        serving_size,
        serving_unit,
        calories,
        protein,
        carbs,
        fat,
        CASE
          WHEN created_by_user_id IS NULL
          THEN 0
          ELSE 1
        END AS is_custom
      FROM Foods
      WHERE (
        created_by_user_id IS NULL
        OR created_by_user_id = ?
      )
      AND name LIKE ?
    `

    const params = [
      userId,
      `%${searchTerm}%`
    ]

    if (category) {
      query += `
        AND category = ?
      `

      params.push(category)
    }

    query += `
      ORDER BY
        category ASC,
        name ASC
    `

    const [rows] =
      await pool.execute(
        query,
        params
      )

    return rows
  },

  async create(
    userId,
    foodData
  ) {
    const {
      name,
      category,
      servingSize,
      servingUnit,
      calories,
      protein = 0,
      carbs = 0,
      fat = 0
    } = foodData

    const [result] =
      await pool.execute(
        `INSERT INTO Foods
          (
            created_by_user_id,
            name,
            category,
            serving_size,
            serving_unit,
            calories,
            protein,
            carbs,
            fat
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          name,
          category,
          servingSize,
          servingUnit,
          calories,
          protein,
          carbs,
          fat
        ]
      )

    return this.findById(
      result.insertId,
      userId
    )
  }
}

module.exports = Food
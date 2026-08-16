const pool = require('../config/db')

const Meal = {
  async findAllByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT
        m.meal_id,
        m.meal_name,
        m.meal_type,
        m.meal_date,
        m.serving_size,
        m.serving_unit,
        m.created_at,

        CASE
          WHEN m.calories IS NOT NULL
            THEN m.calories
          ELSE COALESCE(
            SUM(f.calories * mi.quantity),
            0
          )
        END AS calories,

        CASE
          WHEN m.protein IS NOT NULL
            THEN m.protein
          ELSE COALESCE(
            SUM(f.protein * mi.quantity),
            0
          )
        END AS protein,

        CASE
          WHEN m.carbs IS NOT NULL
            THEN m.carbs
          ELSE COALESCE(
            SUM(f.carbs * mi.quantity),
            0
          )
        END AS carbs,

        CASE
          WHEN m.fat IS NOT NULL
            THEN m.fat
          ELSE COALESCE(
            SUM(f.fat * mi.quantity),
            0
          )
        END AS fat

       FROM Meals m

       LEFT JOIN Meal_Items mi
         ON m.meal_id = mi.meal_id

       LEFT JOIN Foods f
         ON mi.food_id = f.food_id

       WHERE m.user_id = ?

       GROUP BY
         m.meal_id,
         m.meal_name,
         m.meal_type,
         m.meal_date,
         m.serving_size,
         m.serving_unit,
         m.calories,
         m.protein,
         m.carbs,
         m.fat,
         m.created_at

       ORDER BY
         m.meal_date DESC,
         m.created_at DESC`,
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
        meal_type,
        meal_date,
        serving_size,
        serving_unit,
        calories,
        protein,
        carbs,
        fat,
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

  async createWithItems(
    userId,
    mealName,
    mealType,
    mealDate,
    items
  ) {
    const connection =
      await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [mealResult] =
        await connection.execute(
          `INSERT INTO Meals
            (
              user_id,
              meal_name,
              meal_type,
              meal_date
            )
           VALUES (?, ?, ?, ?)`,
          [
            userId,
            mealName,
            mealType,
            mealDate
          ]
        )

      const mealId =
        mealResult.insertId

      for (const item of items) {
        await connection.execute(
          `INSERT INTO Meal_Items
            (
              meal_id,
              food_id,
              quantity
            )
           VALUES (?, ?, ?)`,
          [
            mealId,
            item.foodId,
            item.quantity
          ]
        )
      }

      await connection.commit()

      return mealId
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  async createManual(
    userId,
    mealData
  ) {
    const {
      mealName,
      mealType,
      mealDate,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat
    } = mealData

    const [result] =
      await pool.execute(
        `INSERT INTO Meals
          (
            user_id,
            meal_name,
            meal_type,
            meal_date,
            serving_size,
            serving_unit,
            calories,
            protein,
            carbs,
            fat
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          mealName,
          mealType,
          mealDate,
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

  async updateWithItems(
    userId,
    mealId,
    mealName,
    mealType,
    mealDate,
    items
  ) {
    const connection =
      await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [mealResult] =
        await connection.execute(
          `UPDATE Meals
           SET
             meal_name = ?,
             meal_type = ?,
             meal_date = ?,
             serving_size = NULL,
             serving_unit = NULL,
             calories = NULL,
             protein = NULL,
             carbs = NULL,
             fat = NULL
           WHERE meal_id = ?
           AND user_id = ?`,
          [
            mealName,
            mealType,
            mealDate,
            mealId,
            userId
          ]
        )

      if (
        mealResult.affectedRows === 0
      ) {
        await connection.rollback()
        return false
      }

      await connection.execute(
        `DELETE FROM Meal_Items
         WHERE meal_id = ?`,
        [mealId]
      )

      for (const item of items) {
        await connection.execute(
          `INSERT INTO Meal_Items
            (
              meal_id,
              food_id,
              quantity
            )
           VALUES (?, ?, ?)`,
          [
            mealId,
            item.foodId,
            item.quantity
          ]
        )
      }

      await connection.commit()

      return true
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  async updateManual(
    userId,
    mealId,
    mealData
  ) {
    const connection =
      await pool.getConnection()

    try {
      await connection.beginTransaction()

      const {
        mealName,
        mealType,
        mealDate,
        servingSize,
        servingUnit,
        calories,
        protein,
        carbs,
        fat
      } = mealData

      const [result] =
        await connection.execute(
          `UPDATE Meals
           SET
             meal_name = ?,
             meal_type = ?,
             meal_date = ?,
             serving_size = ?,
             serving_unit = ?,
             calories = ?,
             protein = ?,
             carbs = ?,
             fat = ?
           WHERE meal_id = ?
           AND user_id = ?`,
          [
            mealName,
            mealType,
            mealDate,
            servingSize,
            servingUnit,
            calories,
            protein,
            carbs,
            fat,
            mealId,
            userId
          ]
        )

      if (result.affectedRows === 0) {
        await connection.rollback()
        return false
      }

      /*
        If this meal used to be a
        food-builder meal, remove those
        food items when converting it
        into a manual entry.
      */
      await connection.execute(
        `DELETE FROM Meal_Items
         WHERE meal_id = ?`,
        [mealId]
      )

      await connection.commit()

      return true
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  async addItem(
    mealId,
    foodId,
    quantity = 1
  ) {
    const [result] =
      await pool.execute(
        `INSERT INTO Meal_Items
          (
            meal_id,
            food_id,
            quantity
          )
         VALUES (?, ?, ?)`,
        [
          mealId,
          foodId,
          quantity
        ]
      )

    return result.insertId
  },

  async updateItem(
    mealItemId,
    quantity
  ) {
    const [result] =
      await pool.execute(
        `UPDATE Meal_Items
         SET quantity = ?
         WHERE meal_item_id = ?`,
        [
          quantity,
          mealItemId
        ]
      )

    return result.affectedRows
  },

  async removeItem(mealItemId) {
    const [result] =
      await pool.execute(
        `DELETE FROM Meal_Items
         WHERE meal_item_id = ?`,
        [mealItemId]
      )

    return result.affectedRows
  },

  async updateName(
    mealId,
    userId,
    mealName
  ) {
    const [result] =
      await pool.execute(
        `UPDATE Meals
         SET meal_name = ?
         WHERE meal_id = ?
         AND user_id = ?`,
        [
          mealName,
          mealId,
          userId
        ]
      )

    return result.affectedRows
  },

  async delete(mealId, userId) {
    const [result] =
      await pool.execute(
        `DELETE FROM Meals
         WHERE meal_id = ?
         AND user_id = ?`,
        [
          mealId,
          userId
        ]
      )

    return result.affectedRows
  }
}

module.exports = Meal
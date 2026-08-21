const pool =
  require('../config/db')

const WeightHistory = {
  async findAllByUser(
    userId
  ) {
    const [rows] =
      await pool.execute(
        `SELECT
          weight_entry_id,
          user_id,
          weight,
          recorded_date,
          created_at
         FROM Weight_History
         WHERE user_id = ?
         ORDER BY
          recorded_date DESC,
          created_at DESC`,
        [userId]
      )

    return rows
  },

  async findByUserAndDate(
    userId,
    recordedDate
  ) {
    const [rows] =
      await pool.execute(
        `SELECT
          weight_entry_id,
          user_id,
          weight,
          recorded_date,
          created_at
         FROM Weight_History
         WHERE user_id = ?
         AND recorded_date = ?`,
        [
          userId,
          recordedDate
        ]
      )

    return rows[0]
  },

  async save(
    userId,
    weight,
    recordedDate
  ) {
    await pool.execute(
      `INSERT INTO Weight_History
        (
          user_id,
          weight,
          recorded_date
        )
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
          weight =
            VALUES(weight)`,
      [
        userId,
        weight,
        recordedDate
      ]
    )

    return this.findByUserAndDate(
      userId,
      recordedDate
    )
  },

  async delete(
    weightEntryId,
    userId
  ) {
    const [result] =
      await pool.execute(
        `DELETE
         FROM Weight_History
         WHERE weight_entry_id = ?
         AND user_id = ?`,
        [
          weightEntryId,
          userId
        ]
      )

    return result.affectedRows
  }
}

module.exports =
  WeightHistory
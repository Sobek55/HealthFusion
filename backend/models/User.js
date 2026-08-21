const pool = require('../config/db')

const User = {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    )

    return rows[0]
  },

  async findById(userId) {
    const [rows] = await pool.execute(
      `SELECT
        user_id,
        first_name,
        last_name,
        email,
        created_at
       FROM Users
       WHERE user_id = ?`,
      [userId]
    )

    return rows[0]
  },

  async create(firstName, lastName, email, passwordHash) {
    const [result] = await pool.execute(
      `INSERT INTO Users
        (first_name, last_name, email, password_hash)
       VALUES (?, ?, ?, ?)`,
      [firstName, lastName, email, passwordHash]
    )

    return result.insertId
  },

  async updatePassword(userId, passwordHash) {
    await pool.execute(
      `UPDATE Users
       SET password_hash = ?
       WHERE user_id = ?`,
      [passwordHash, userId]
    )

    return true
  }
}

module.exports = User

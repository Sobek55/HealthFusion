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

  async create(
    firstName,
    lastName,
    email,
    passwordHash,
    passwordHint = null
  ) {
    const [result] = await pool.execute(
      `INSERT INTO Users
        (
          first_name,
          last_name,
          email,
          password_hash,
          password_hint
        )
       VALUES (?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        passwordHash,
        passwordHint
      ]
    )

    return result.insertId
  },

  async updatePassword(
    userId,
    passwordHash
  ) {
    await pool.execute(
      `UPDATE Users
       SET password_hash = ?
       WHERE user_id = ?`,
      [passwordHash, userId]
    )
  },

  async saveResetToken(
    userId,
    tokenHash,
    expiresAt
  ) {
    await pool.execute(
      `DELETE FROM Password_Reset_Tokens
       WHERE user_id = ?`,
      [userId]
    )

    await pool.execute(
      `INSERT INTO Password_Reset_Tokens
        (user_id, token_hash, expires_at)
       VALUES (?, ?, ?)`,
      [userId, tokenHash, expiresAt]
    )
  },

  async findResetToken(tokenHash) {
    const [rows] = await pool.execute(
      `SELECT
        reset_id,
        user_id,
        expires_at
       FROM Password_Reset_Tokens
       WHERE token_hash = ?
         AND expires_at > NOW()
       LIMIT 1`,
      [tokenHash]
    )

    return rows[0]
  },

  async deleteResetTokens(userId) {
    await pool.execute(
      `DELETE FROM Password_Reset_Tokens
       WHERE user_id = ?`,
      [userId]
    )
  }
}

module.exports = User

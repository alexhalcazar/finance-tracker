import pool from '../db.js';
import bcrypt from 'bcryptjs';

// Create a new user
async function createUser(username, password) {
  if (!username || !password) {
    throw new Error('Username and password required');
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hash]
    );
    return rows[0];
  } catch (err) {
    if (err.code === '23505') {
      throw new Error('Username already taken');
    }
    throw err;
  }
}

// Find user by username
async function findUserByUsername(username) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return rows[0] || null;
}

// Verify user password
async function verifyUser(username, password) {
  const user = await findUserByUsername(username);
  if (!user) {
    return null;
  }
  const match = await bcrypt.compare(password, user.password_hash);
  return match ? user : null;
}

export { createUser, findUserByUsername, verifyUser };
import { pool } from './index.js';

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

export async function one(text, params) {
  const { rows } = await pool.query(text, params);
  return rows[0] || null;
}

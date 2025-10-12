// Utility functions for securely hashing and verifying passwords using bcryptjs (ESM)

import bcrypt from 'bcryptjs';


//Min, Max, and  Default rounds.
const DEFAULT_ROUNDS = 12; 
const MIN_ROUNDS = 10;
const MAX_ROUNDS = 14;


/**
 * Parse an environment value for bcrypt rounds.
 * Ensures the result is a valid integer and clamps it
 * between MIN_ROUNDS and MAX_ROUNDS.
 *
 * @param {string|undefined} val - Environment variable value
 * @returns {number} - Safe cost factor for bcrypt
 */
function parseRounds(val) {
  const n = Number.parseInt(val, 10);
  if (!Number.isFinite(n)) return DEFAULT_ROUNDS;
  return Math.min(MAX_ROUNDS, Math.max(MIN_ROUNDS, n));
}

// Final number of bcrypt rounds to use, derived from .env or defaults.
const ROUNDS = parseRounds(process.env.BCRYPT_ROUNDS);  


/**
 * Hash a plain-text password with bcrypt.
 * Bcrypt automatically generates a unique salt for each password.
 *
 * @param {string} plain - The plain-text password
 * @returns {Promise<string>} - The hashed password
 * @throws {Error} - If password is invalid
 */
async function hashPassword(plain) {
  if (typeof plain !== 'string' || !plain) {
    throw new Error('Invalid password');
  }
  return bcrypt.hash(plain, ROUNDS); // bcrypt generates salt internally
}


/**
 * Verify a plain-text password against a hashed password.
 *
 * @param {string} plain - The plain-text password
 * @param {string} hashed - The hashed password from the DB
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
async function verifyPassword(plain, hashed) {
  if (typeof plain !== 'string' || !plain) return false;
  if (typeof hashed !== 'string' || !hashed) return false;
  try {
    return await bcrypt.compare(plain, hashed);
  } catch {
    return false;
  }
}

// Export utilities for use in registration/login routes
export { hashPassword, verifyPassword };



/*
====================================
 Example usage:

import { hashPassword, verifyPassword } from './utils/hash.js';

// Registration
const plainPassword = 'SuperSecret!';
const hashedPassword = await hashPassword(plainPassword);
// Save hashedPassword in DB

// Login
const isValid = await verifyPassword('SuperSecret!', hashedPassword);
if (isValid) {
  console.log('Login success!');
} else {
  console.log('Invalid password');
}
====================================
*/
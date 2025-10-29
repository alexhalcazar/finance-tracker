import jwt from "jsonwebtoken";

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_TTL = "15m",
  JWT_REFRESH_TTL = "7d",
} = process.env;

// Validate secret is set
if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET must be set in environment variables");
}

/**
 * Generate a JWT access token for a user
 *
 * @param {object} user - User object from database
 * @param {number} user.user_id - User ID
 * @param {string} user.email - User email
 * @param {string} user.username - Username
 * @returns {string} JWT token
 */
export function generateAccessToken(user) {
  const payload = {
    user_id: user.user_id,
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_TTL,
    algorithm: "HS256",
  });
}

/**
 * Verify and decode a JWT token
 *
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET, {
    algorithms: ["HS256"],
  });
}

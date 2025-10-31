import rateLimit from "express-rate-limit";

/**
 * Rate limiter for login attempts
 * Prevents brute force attacks by limiting login attempts
 *
 * Configuration:
 * - 5 attempts per 15 minutes per IP address
 * - Returns 429 status code when limit exceeded
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error:
      "Too many login attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip successful requests (only count failed login attempts)
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for registration attempts
 * Prevents spam account creation
 *
 * Configuration:
 * - 3 accounts per hour per IP address
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration requests per hour
  message: {
    error:
      "Too many accounts created from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

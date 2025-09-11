import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_WINDOW_MS || 900000),
  max: Number(process.env.LOGIN_MAX_ATTEMPTS || 5),
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please try again later.'
});

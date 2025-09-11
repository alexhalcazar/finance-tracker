import { Router } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';
import { one, query } from '../db/sql.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { handleValidation } from '../middleware/validate.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';
import { ensureStrongPassword } from '../services/passwordStrength.js';

const router = Router();

const LOCK_AFTER = Number(process.env.LOCK_AFTER_FAILED_LOGINS || 5);
const LOCK_MINUTES = Number(process.env.LOCK_DURATION_MINUTES || 15);

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

// --- REGISTER ---
router.post(
  '/register',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 chars'),
  handleValidation,
  async (req, res) => {
    const { email, password, full_name } = req.body;

    if (!ensureStrongPassword(password)) {
      return res.status(400).json({ error: 'Password too weak. Use a longer, less predictable passphrase.' });
    }

    const existing = await one('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const password_hash = await hashPassword(password);
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, created_at`,
      [email.toLowerCase(), password_hash, full_name || null]
    );

    const user = rows[0];

    // You can optionally auto-login on register:
    const accessToken = signAccessToken(user);
    const { token: refreshToken, jti } = signRefreshToken(user);
    await query(
      'INSERT INTO refresh_tokens (user_id, jti, token_hash, expires_at) VALUES ($1, $2, $3, NOW() + $4::interval)',
      [user.id, jti, sha256(refreshToken), process.env.JWT_REFRESH_TTL || '7 days']
    );

    res.status(201).json({
      user: { id: user.id, email: user.email, full_name: user.full_name },
      tokens: { accessToken, refreshToken }
    });
  }
);

// --- LOGIN ---
router.post(
  '/login',
  loginRateLimiter,
  body('email').isEmail(),
  body('password').isString(),
  handleValidation,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await one('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutes = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({ error: `Account locked. Try again in ~${minutes} min.` });
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      // increment failed count and lock if needed
      const failed = (user.failed_logins || 0) + 1;
      let lockedUntil = null;
      if (failed >= LOCK_AFTER) {
        lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
      }
      await query(
        `UPDATE users SET failed_logins=$1, locked_until=$2, updated_at=NOW() WHERE id=$3`,
        [failed, lockedUntil, user.id]
      );
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // success: reset counters
    await query(
      `UPDATE users SET failed_logins=0, locked_until=NULL, updated_at=NOW() WHERE id=$1`,
      [user.id]
    );

    const accessToken = signAccessToken(user);
    const { token: refreshToken, jti } = signRefreshToken(user);
    await query(
      'INSERT INTO refresh_tokens (user_id, jti, token_hash, expires_at) VALUES ($1, $2, $3, NOW() + $4::interval)',
      [user.id, jti, sha256(refreshToken), process.env.JWT_REFRESH_TTL || '7 days']
    );

    res.json({ tokens: { accessToken, refreshToken } });
  }
);

// --- REFRESH (rotate token) ---
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body; // (You can also use httpOnly cookie)
  if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });

  try {
    const payload = verifyRefreshToken(refreshToken); // { sub, jti, iat, exp }
    const stored = await one(
      'SELECT * FROM refresh_tokens WHERE user_id=$1 AND jti=$2',
      [payload.sub, payload.jti]
    );
    if (!stored) return res.status(401).json({ error: 'Invalid refresh token' });

    // compare hashes
    const hash = sha256(refreshToken);
    if (hash !== stored.token_hash) {
      // token reuse / stolen token
      await query('DELETE FROM refresh_tokens WHERE user_id=$1', [payload.sub]); // revoke all
      return res.status(401).json({ error: 'Token reuse detected. All sessions revoked.' });
    }

    // rotate: delete old, issue new
    await query('DELETE FROM refresh_tokens WHERE id=$1', [stored.id]);

    const user = await one('SELECT id, email FROM users WHERE id=$1', [payload.sub]);
    const accessToken = signAccessToken(user);
    const { token: newRefresh, jti } = signRefreshToken(user);

    await query(
      'INSERT INTO refresh_tokens (user_id, jti, token_hash, expires_at) VALUES ($1, $2, $3, NOW() + $4::interval)',
      [user.id, jti, sha256(newRefresh), process.env.JWT_REFRESH_TTL || '7 days']
    );

    res.json({ tokens: { accessToken, refreshToken: newRefresh } });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// --- LOGOUT (revoke refresh token) ---
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body; // or from cookie
  if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });

  try {
    const payload = verifyRefreshToken(refreshToken);
    await query('DELETE FROM refresh_tokens WHERE user_id=$1 AND jti=$2', [payload.sub, payload.jti]);
  } catch {}
  // Client should drop access token locally
  return res.json({ ok: true });
});

// --- (Optional) Me ---
router.get('/me', async (req, res) => {
  // We’ll protect this with JWT middleware in index.js example route
  res.json({ message: 'Attach this route to auth middleware in index.js' });
});

export default router;

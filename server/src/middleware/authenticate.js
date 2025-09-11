import { verifyAccessToken } from '../utils/jwt.js';

export function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' '); // "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'Missing Authorization header' });

  try {
    const payload = verifyAccessToken(token); // { sub, email, iat, exp }
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

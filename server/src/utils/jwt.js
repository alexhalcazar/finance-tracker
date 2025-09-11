import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_TTL = '15m',
  JWT_REFRESH_TTL = '7d',
} = process.env;

export function signAccessToken(user) {
  // keep payload minimal
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_ACCESS_SECRET,
    { expiresIn: JWT_ACCESS_TTL, algorithm: 'HS256' }
  );
}

export function signRefreshToken(user, jti = uuidv4()) {
  const token = jwt.sign(
    { sub: user.id, jti },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_TTL, algorithm: 'HS256' }
  );
  return { token, jti };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET, { algorithms: ['HS256'] });
}

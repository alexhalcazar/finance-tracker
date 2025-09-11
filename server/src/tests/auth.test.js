// server/src/tests/auth.test.js
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../app.js';
import { query } from '../db/sql.js';
import { pool } from '../db/index.js';
import bcrypt from 'bcryptjs';

const schemaSql = fs.readFileSync(path.resolve('src/db/schema.sql'), 'utf8');

beforeAll(async () => {
  // Ensure schema exists and tables are clean for a deterministic test run
  await query(schemaSql);
  await query('DELETE FROM refresh_tokens');
  await query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});

describe('Auth System', () => {
  let accessToken;
  let refreshToken;

  test('Registers a new user with hashed password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Correct Horse Battery 123!', full_name: 'Test User' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.tokens.accessToken).toBeTruthy();
    expect(res.body.tokens.refreshToken).toBeTruthy();

    accessToken = res.body.tokens.accessToken;
    refreshToken = res.body.tokens.refreshToken;

    // Verify DB stored a bcrypt hash
    const { rows } = await query('SELECT password_hash FROM users WHERE email=$1', ['test@example.com']);
    expect(rows.length).toBe(1);
    const ok = await bcrypt.compare('Correct Horse Battery 123!', rows[0].password_hash);
    expect(ok).toBe(true);
  });

  test('Rejects weak password on registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'weak@example.com', password: 'password' }); // 8+ chars, but still weak
    expect(res.status).toBe(400);
    expect((res.body.error || '').toLowerCase()).toContain('password');
  });


  test('Logs in with correct credentials and returns tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Correct Horse Battery 123!' });

    expect(res.status).toBe(200);
    expect(res.body.tokens.accessToken).toBeTruthy();
    expect(res.body.tokens.refreshToken).toBeTruthy();

    accessToken = res.body.tokens.accessToken;
    refreshToken = res.body.tokens.refreshToken;
  });

  test('Rejects invalid login credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });
    expect([401, 423]).toContain(res.status); // 423 if account got locked
  });

  test('Protects routes without valid token', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(401);
  });

  test('Allows access to protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBeTruthy();
  });

  test('Refresh endpoint rotates tokens', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.tokens.accessToken).toBeTruthy();
    expect(res.body.tokens.refreshToken).toBeTruthy();

    // update tokens for next tests
    accessToken = res.body.tokens.accessToken;
    refreshToken = res.body.tokens.refreshToken;
  });

  test('Logout revokes refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken });
    expect(res.status).toBe(200);

    // Using the same refresh token again should fail
    const res2 = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(res2.status).toBe(401);
  });

  test('Rate limits login attempts (per IP)', async () => {
    // Purposefully hit wrong creds multiple times to trigger limiter (default max=5)
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/auth/login').send({ email: 'nope@example.com', password: 'wrong' });
    }
    const res = await request(app).post('/api/auth/login').send({ email: 'nope@example.com', password: 'wrong' });
    // Expect 429 from express-rate-limit; if you also enabled account lock, you may see 423 for real accounts
    expect(res.status).toBe(429);
  });
});

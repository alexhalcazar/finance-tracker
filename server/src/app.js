import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import { authenticateJWT } from './middleware/authenticate.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3030',
    credentials: true,
  })
);

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Auth routes
app.use('/api/auth', authRoutes);

// Example protected route
app.get('/api/transactions', authenticateJWT, async (req, res) => {
  res.json({ message: `Hello user ${req.user.id}, here are your transactions []` });
});

//const port = process.env.PORT || 8080;
//app.listen(port, () => console.log(`API listening on http://localhost:${port}`));

export default app;



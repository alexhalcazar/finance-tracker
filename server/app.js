import "dotenv/config";
import express from "express";
import { verifyToken } from "./src/middleware/jwt.js";
import dummyRouter from "#routes/dummy";
import authRouter from "./src/routes/auth.js";
import bankRouter from "#routes/bank";
import plaidRouter from "#routes/plaid";
import budgets from "#routes/budgets";
import transactions from "#routes/transactions";

const app = express();
const PORT = 8080;

app.use(express.json());

// Public ping (no auth)
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

// Auth routes (public - no token required)
app.use("/api/auth", authRouter);

// Protected dummy router: GET /api/dummy
app.use("/api/dummy", verifyToken, dummyRouter);

app.use("/api/bank", verifyToken, bankRouter);
app.use("/api/plaid", verifyToken, plaidRouter);
app.use("/api/budgets", verifyToken, budgets);

// transaction routes
app.use("/api/transactions", verifyToken, transactions);

if (["development", "production"].includes(process.env.ENVIRONMENT)) {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} else {
  console.log("Server not started (test mode).");
}

export default app;

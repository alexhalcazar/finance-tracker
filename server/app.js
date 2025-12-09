import "dotenv/config";
console.log("🔍 GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
console.log("🔍 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
import express from "express";
import { verifyToken } from "./src/middleware/jwt.js";
import passport from "./src/config/passport.js";
import dummyRouter from "#routes/dummy";
import authRouter from "#routes/auth";
import bankRouter from "#routes/bank";
import plaidRouter from "#routes/plaid";
import budgets from "#routes/budgets";
import categories from "#routes/categories";
import transactions from "#routes/transactions";
import recurringTransactions from "#routes/recurringTransactions";
import summary from "#routes/summary";

const app = express();
const PORT = 3030;

app.use(express.json());
// Initialize Passport for OAuth authentication
//app.use(passport.initialize());

// Public ping (no auth)
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

// Auth routes (public - no token required)
app.use("/api/auth", authRouter);

// Protected dummy router: GET /api/dummy
app.use("/api/dummy", verifyToken, dummyRouter);

app.use("/api/bank", verifyToken, bankRouter);
app.use("/api/plaid", verifyToken, plaidRouter);
app.use("/api/budgets", verifyToken, budgets);

// categories routes
app.use("/api/categories", verifyToken, categories);
// transaction routes
app.use("/api/transactions", verifyToken, transactions);

// recurring transaction routes
app.use("/api/recurring-transactions", verifyToken, recurringTransactions);

// summary routes
app.use("/api/summary", verifyToken, summary);

if (["development", "production"].includes(process.env.ENVIRONMENT)) {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} else {
  console.log("Server not started (test mode).");
}

export default app;

import express from "express";
import { verifyToken } from "src/middleware/jwt";
import { createNewBudget } from "#controllers/budgetController";

const router = express.Router();

router.post("/budgets", verifyToken, createNewBudget);

export default router;

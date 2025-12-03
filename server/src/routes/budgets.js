import express from "express";
import { verifyToken } from "#middleware/jwt";
import {
  createNewBudget,
  getAllBudgets,
  getBudgetById,
} from "#controllers/budgetController";

const router = express.Router();

router.post("/", verifyToken, createNewBudget);
router.get("/", verifyToken, getAllBudgets);
router.get("/:budget_id", verifyToken, getBudgetById);

export default router;

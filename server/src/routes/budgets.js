import express from "express";
import { verifyToken } from "#middleware/jwt";
import {
  createNewBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "#controllers/budgetController";

const router = express.Router();

router.post("/", verifyToken, createNewBudget);
router.get("/", verifyToken, getAllBudgets);
router.get("/:budget_id", verifyToken, getBudgetById);
router.put("/:budget_id", verifyToken, updateBudget);
router.delete("/:budget_id", verifyToken, deleteBudget);

export default router;

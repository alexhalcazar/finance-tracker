import express from "express";
import { verifyToken } from "#middleware/jwt";
import {
  createNewRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransaction,
} from "#controllers/recurringTransactionController";

const router = express.Router();

router.post("/", verifyToken, createNewRecurringTransaction);
router.get("/:recurring_id?", verifyToken, getRecurringTransaction);
router.put("/:recurring_id", verifyToken, updateRecurringTransaction);
router.delete("/:recurring_id", verifyToken, deleteRecurringTransaction);
export default router;

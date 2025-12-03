import express from "express";
import { verifyToken } from "#middleware/jwt";
import {
  createNewRecurringTransaction,
  updateRecurringTransaction,
} from "#controllers/recurringTransactionController";

const router = express.Router();

router.post("/", verifyToken, createNewRecurringTransaction);
router.put("/:recurring_id", verifyToken, updateRecurringTransaction);
export default router;

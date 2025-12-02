import express from "express";
import { verifyToken } from "#middleware/jwt";
import { createNewRecurringTransaction } from "#controllers/recurringTransactionController";

const router = express.Router();

router.post("/", verifyToken, createNewRecurringTransaction);
export default router;

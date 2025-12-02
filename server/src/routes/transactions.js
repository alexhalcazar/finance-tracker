import express from "express";
import { verifyToken } from "#middleware/jwt";
import {
  createNewTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "#controllers/transactionController";

const router = express.Router();

router.post("/", verifyToken, createNewTransaction);
router.get("/:transaction_id?", verifyToken, getTransaction);
router.put("/:transaction_id", verifyToken, updateTransaction);
router.delete("/:transaction_id", verifyToken, deleteTransaction);
export default router;

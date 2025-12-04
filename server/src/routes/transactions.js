import express from "express";
import {
  createNewTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "#controllers/transactionController";

const router = express.Router();

router.post("/", createNewTransaction);
router.get("/:transaction_id?", getTransaction);
router.put("/:transaction_id", updateTransaction);
router.delete("/:transaction_id", deleteTransaction);
export default router;

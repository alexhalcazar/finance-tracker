import express from "express";
import { verifyToken } from "#middleware/jwt";
import { createNewTransaction } from "#controllers/transactionController";

const router = express.Router();

router.post("/", verifyToken, createNewTransaction);

export default router;

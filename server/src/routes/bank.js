import express from "express";
import { getTransactions } from "#controllers/bankController";

const router = express.Router();

router.post("/transactions", getTransactions);

export default router;

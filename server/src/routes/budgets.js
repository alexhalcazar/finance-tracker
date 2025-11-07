import express from "express";
import { verifyToken } from "#middleware/jwt";
import { createNewBudget } from "#controllers/budgetController";

const router = express.Router();

router.post("/", verifyToken, createNewBudget);

export default router;

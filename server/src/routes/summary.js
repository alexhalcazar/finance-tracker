import express from "express";

import {
  getTotalGlobalIncome,
  getTotalGlobalExpenses,
  getRemainingBudgetForMonth,
} from "#controllers/summaryController";

const router = express.Router();

router.get("/income", getTotalGlobalIncome);
router.get("/expenses", getTotalGlobalExpenses);
router.get("/remaining-budget", getRemainingBudgetForMonth);

export default router;

import express from "express";

import { getTotalGlobalIncome } from "#controllers/summaryController";

const router = express.Router();

router.get("/income", getTotalGlobalIncome);

export default router;

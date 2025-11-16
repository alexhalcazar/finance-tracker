import express from "express";
import { verifyToken } from "#middleware/jwt";
import {
  getCategory,
  getAllCategories,
  createNewCategory,
} from "#controllers/categoryController";

const router = express.Router();

router.get("/:user_id", verifyToken, getCategory);
router.get("/:budget_id", verifyToken, getAllCategories);

export default router;

import express from "express";
import { verifyToken } from "#middleware/jwt";
import {
  getCategory,
  getAllCategories,
  createNewCategory,
  updateCategory,
  deleteCategory,
} from "#controllers/categoryController";

const router = express.Router();

router.get("/:user_id", getCategory);
router.get("/:budget_id", getAllCategories);
router.post("/", createNewCategory);
router.put("/", updateCategory);
router.delete("/", deleteCategory);
export default router;

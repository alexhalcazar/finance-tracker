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

router.get("/:user_id", verifyToken, getCategory);
router.get("/:budget_id", verifyToken, getAllCategories);
router.post("/", verifyToken, createNewCategory);
router.put("/", verifyToken, updateCategory);
router.delete("/", verifyToken, deleteCategory);
export default router;

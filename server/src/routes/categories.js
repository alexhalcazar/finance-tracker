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

router.get("/budget/:budget_id?", getAllCategories);
router.get("/:category_id", getCategory);
router.post("/budget/:budget_id", createNewCategory);
router.put("/:category_id", updateCategory);
router.delete("/:category_id", deleteCategory);
export default router;

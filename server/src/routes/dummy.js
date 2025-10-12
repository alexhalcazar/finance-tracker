import { Router } from "express";
const router = Router();

// GET /api/dummy  (protected by verifyToken at mount)
router.get("/", (req, res) => {
  res.json({
    ok: true,
    user: req.user || null,
    note: "This is a protected dummy endpoint. Replace me later."
  });
});

export default router;

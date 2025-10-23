import express from "express";
import { getLinkToken, exchangeLinkToken } from "#controllers/plaidController";

const router = express.Router();

router.get("/get_link_token", getLinkToken);
router.post("/exchange_link_token", exchangeLinkToken);

export default router;

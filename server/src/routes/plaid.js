import express from "express";
import {
  getLinkToken,
  exchangeLinkToken,
  getAccessToken,
} from "#controllers/plaidController";

const router = express.Router();

router.get("/get_link_token", getLinkToken);
router.get("/get_access_token", getAccessToken);
router.post("/exchange_link_token", exchangeLinkToken);

export default router;

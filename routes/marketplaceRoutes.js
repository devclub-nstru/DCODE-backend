import express from "express";
import {
  getAvailableIssues,
  purchaseIssue,
} from "../controllers/marketplaceController.js";
import { verifyToken } from "../controllers/authcontroller.js";

const router = express.Router();

router.get("/issues", getAvailableIssues);
router.post("/purchase", verifyToken, purchaseIssue);

export default router;

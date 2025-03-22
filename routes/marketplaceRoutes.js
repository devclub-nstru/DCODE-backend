import express from "express";
import {
  getAvailableIssues,
  purchaseIssue,
  getIssueDetails,
} from "../controllers/marketplaceController.js";
import { verifyToken } from "../controllers/authcontroller.js";

const router = express.Router();

router.get("/issues", getAvailableIssues);
router.post("/purchase", verifyToken, purchaseIssue);
router.get("/issues/:issueId", getIssueDetails);

export default router;

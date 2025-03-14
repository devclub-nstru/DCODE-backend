import express from "express";
import {
  transferDCoins,
  getTransactionHistory,
} from "../controllers/transactionController.js";
import { verifyToken } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/transfer", verifyToken, transferDCoins);
router.get("/history", verifyToken, getTransactionHistory);

export default router;

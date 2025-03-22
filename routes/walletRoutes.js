import express from "express";
import { getWalletBalance } from "../controllers/walletController.js";
import { verifyToken } from "../controllers/authcontroller.js";

const router = express.Router();

router.get("/balance", verifyToken, getWalletBalance);

export default router;

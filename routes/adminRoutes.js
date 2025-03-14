import express from "express";
import { addCoins, deductCoins } from "../controllers/adminController.js";
// import { verifyToken, verifyAdmin } from "../controllers/authcontroller.js"; // Assuming you have an admin verification middleware

const router = express.Router();

router.post("/add-coins", addCoins);
router.post("/deduct-coins", deductCoins);

export default router;

import express from "express";
import { openMysteryBox } from "../controllers/mysteryBoxController.js";
import { verifyToken } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/open", verifyToken, openMysteryBox);

export default router;

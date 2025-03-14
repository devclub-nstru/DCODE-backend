// routes/authroutes.js
import express from "express";
import { signup, signin, verifyToken } from "../controllers/authcontroller.js";
import { googleAuth } from "../controllers/googleauthcontroller.js";

const router = express.Router();

// Regular authentication routes
router.post("/signup", signup);
router.post("/signin", signin);

// Google authentication route
router.post("/google", googleAuth);

// Protected route example
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

export default router;

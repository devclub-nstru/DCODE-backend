import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authroute.js";
import userRoutes from "./routes/userroute.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rateLimit from "express-rate-limit";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import mysteryBoxRoutes from "./routes/mysteryBoxRoutes.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests, please try again later.",
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// app.use("/api/auth", authRoutes);

app.use("/api/auth", limiter, authRoutes);
app.use("/api/user", limiter, userRoutes);
app.use("/api/transactions", limiter, transactionRoutes);
app.use("/api/admin", limiter, adminRoutes);
app.use("/api/marketplace", limiter, marketplaceRoutes);
app.use("/api/wallet", limiter, walletRoutes);
app.use("/api/mystery-box", mysteryBoxRoutes);

app.listen(4000, () => {
  console.log(`Server is running on port ${4000}`);
});

import User from "../models/usermodel.js";
import Transaction from "../models/transactionModel.js";

const ADMIN_ID = "67d37baeee20cbd55d975e1f"; // Admin's user ID

export const addCoins = async (req, res) => {
  const { userId, amount, key } = req.body;

  try {
    if (
      key !==
      "sdfghj345678@#$%^234567WDERFG23456EDFRGT$%^&4567#$%^&4567#$%^&$654321234567)(*&^%$#@!"
    ) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    const admin = await User.findById(ADMIN_ID);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (admin.dCoins < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient D-Coins in admin wallet" });
    }

    // Deduct coins from admin wallet
    admin.dCoins -= amount;
    await admin.save();

    // Add coins to user wallet
    user.dCoins += amount;
    await user.save();

    // Create a transaction record
    const transaction = new Transaction({
      senderId: ADMIN_ID,
      receiverId: userId,
      amount,
      type: "transfer",
      status: "completed",
      admin_transaction: true,
    });
    await transaction.save();

    res.status(200).json({ message: "D-Coins added successfully", user });
  } catch (error) {
    console.error("Error adding D-Coins:", error);
    res.status(500).json({ message: "Server error during adding D-Coins" });
  }
};

export const deductCoins = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    if (
      key !==
      "sdfghj345678@#$%^234567WDERFG23456EDFRGT$%^&4567#$%^&4567#$%^&$654321234567)(*&^%$#@!"
    ) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.dCoins < amount) {
      return res.status(400).json({ message: "Insufficient D-Coins" });
    }

    user.dCoins -= amount;
    await user.save();

    res.status(200).json({ message: "D-Coins deducted successfully", user });
  } catch (error) {
    console.error("Error deducting D-Coins:", error);
    res.status(500).json({ message: "Server error during deducting D-Coins" });
  }
};

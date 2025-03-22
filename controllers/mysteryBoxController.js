import User from "../models/usermodel.js";
import MysteryBoxReward from "../models/mysteryBoxRewardModel.js";
import Transaction from "../models/transactionModel.js";

export const openMysteryBox = async (req, res) => {
  const { boxId } = req.body;
  const userId = req.user;
  const ADMIN_ID = "67d37baeee20cbd55d975e1f"; // Admin's user ID

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Find the mystery box in user's collection
    const mysteryBox = user.mysteryBoxes.find(
      (box) => box.id === boxId && box.unopened === true
    );

    if (!mysteryBox) {
      return res.status(404).json({
        status: false,
        message: "Mystery box not found or already opened",
      });
    }

    // Get the reward amount from MysteryBoxReward collection
    const reward = await MysteryBoxReward.findOne({ boxId });
    if (!reward) {
      return res.status(404).json({
        status: false,
        message: "Reward configuration not found",
      });
    }

    // Update the mystery box to opened status
    mysteryBox.unopened = false;
    mysteryBox.reward = `${reward.dCoinsReward} D-Coins`;

    // Add the reward to user's balance
    user.dCoins += reward.dCoinsReward;
    await user.save();

    // Create a transaction record
    const transaction = new Transaction({
      senderId: ADMIN_ID,
      receiverId: userId,
      amount: reward.dCoinsReward,
      type: "earn",
      status: "completed",
      admin_transaction: true,
    });
    await transaction.save();

    res.status(200).json({
      status: true,
      message: `Successfully opened mystery box and received ${reward.dCoinsReward} D-Coins!`,
      newBalance: user.dCoins,
      reward: reward.dCoinsReward,
    });
  } catch (error) {
    console.error("Error opening mystery box:", error);
    res.status(500).json({
      status: false,
      message: "Server error while opening mystery box",
    });
  }
};

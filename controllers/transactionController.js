import Transaction from "../models/transactionModel.js";
import User from "../models/usermodel.js";

export const transferDCoins = async (req, res) => {
  const { receiverId, amount, is_email } = req.body;
  //   console.log("sadfdsfvdfvc->>>>>>", receiverId, amount, is_email);
  const senderId = req.user.id; // Assuming user ID is available in req.user
  const ADMIN_ID = "67d37baeee20cbd55d975e1f"; // Admin's user ID

  try {
    const sender = await User.findById(senderId);
    if (!sender || sender.dCoins < amount) {
      return res.status(400).json({ message: "Insufficient D-Coins" });
    }

    const fee = Math.round(amount * 0.2); // 20% fee
    const netAmount = Math.round(amount - fee); // Amount to be sent to the receiver

    // Deduct D-Coins from sender (only the net amount)
    sender.dCoins -= amount;
    await sender.save();

    // Add fee to admin's account
    const admin = await User.findById(ADMIN_ID);
    if (admin) {
      admin.dCoins += fee;
      await admin.save();
    }

    let receiver;
    if (is_email) {
      // Check if is_email is true
      console.log("email");
      receiver = await User.findOne({ email: receiverId });
    } else {
      receiver = await User.findById(receiverId);
    }

    if (receiver) {
      receiver.dCoins += netAmount;
      await receiver.save();
    }

    // Create transaction record for the admin fee
    const adminTransaction = new Transaction({
      senderId: senderId,
      receiverId: ADMIN_ID,
      amount: fee,
      type: "fee",
      status: "completed",
    });
    await adminTransaction.save();

    // Create transaction record for the actual payment
    const transaction = new Transaction({
      senderId,
      receiverId: receiver._id,
      amount: netAmount,
      type: "transfer",
      status: "completed",
    });
    await transaction.save();

    res.status(200).json({ message: "Transfer successful", transaction });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ message: "Server error during transfer" });
  }
};

export const getTransactionHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await Transaction.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res
      .status(500)
      .json({ message: "Server error fetching transaction history" });
  }
};

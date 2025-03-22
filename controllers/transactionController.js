import Transaction from "../models/transactionModel.js";
import User from "../models/usermodel.js";

export const transferDCoins = async (req, res) => {
  const { receiverId, amount, is_email } = req.body;
  //   console.log("sadfdsfvdfvc->>>>>>", receiverId, amount, is_email);
  const senderId = req.user;
  const ADMIN_ID = "67d37baeee20cbd55d975e1f";

  try {
    // Add minimum amount validation
    if (amount < 100) {
      return res.json({
        status: false,
        message: "Minimum transfer amount is 100 D-Coins",
      });
    }

    const sender = await User.findById(senderId);
    if (!sender || sender.dCoins < amount) {
      return res.json({ status: false, message: "Insufficient D-Coins" });
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
      // Check if sender is trying to send to their own email
      if (sender.email === receiverId) {
        return res.json({
          status: false,
          message: "Cannot transfer D-Coins to your own account",
        });
      }
      receiver = await User.findOne({ email: receiverId });
    } else {
      receiver = await User.findById(receiverId);
    }

    if (!receiver) {
      return res.status(400).json({ message: "Receiver not found" });
    }

    receiver.dCoins += netAmount;
    await receiver.save();

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
      receiverId: is_email ? receiver._id : receiverId,
      amount: netAmount,
      type: "transfer",
      status: "completed",
    });
    await transaction.save();

    res.status(200).json({
      status: true,
      transaction: {
        ...transaction,
      },
      message: `Transfered ${netAmount} Successfully to ${receiver?.username}`,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ message: "Server error during transfer" });
  }
};

export const getTransactionHistory = async (req, res) => {
  const userId = req.user;

  try {
    const transactions = await Transaction.find({
      $and: [
        { $or: [{ senderId: userId }, { receiverId: userId }] },
        { type: { $ne: "fee" } }, // Exclude transactions with type "fee"
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      transactions,
      currentUserId: userId,
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res
      .status(200)
      .json({ status: false, message: "Error fetching transaction history" });
  }
};

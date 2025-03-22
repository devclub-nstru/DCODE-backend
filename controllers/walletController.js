import User from "../models/usermodel.js";

export const getWalletBalance = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      balance: user.dCoins,
      userId: user._id,
      username: user.username,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.json({
      message: "Server error fetching wallet balance",
      status: false,
    });
  }
};

import Issue from "../models/issuesModel.js";
import User from "../models/usermodel.js";

export const getAvailableIssues = async (req, res) => {
  try {
    const issues = await Issue.find();
    res.status(200).json({ status: true, issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.json({ status: false, message: "Server error fetching issues" });
  }
};

export const purchaseIssue = async (req, res) => {
  const { issueId, githubUsername } = req.body;
  var userId = req.user;
  const ADMIN_ID = "67d37baeee20cbd55d975e1f"; // Admin's user ID

  try {
    const issue = await Issue.findById(issueId);
    const user = await User.findById(userId);

    if (!issue || !user) {
      return res.json({ status: false, message: "Issue or User not found" });
    }

    // Check if the issue has already been purchased
    if (!issue.available) {
      return res.json({
        status: false,
        message: "This issue has already been purchased",
      });
    }

    if (user.dCoins < issue.price) {
      return res.json({ status: false, message: "Insufficient D-Coins" });
    }

    // Deduct the price from user's D-Coins
    user.dCoins -= issue.price;
    await user.save();

    // Add the price to admin's D-Coins
    const admin = await User.findById(ADMIN_ID);
    if (admin) {
      admin.dCoins += issue.price;
      await admin.save();
    }

    // Mark the issue as purchased
    issue.available = false;
    issue.githubUsername = githubUsername;
    issue.purchasedUserId = user;
    issue.labels = issue.labels.filter(
      (label) => label !== "assignment-available"
    );
    issue.labels.push("already-assigned");
    await issue.save();

    res
      .status(200)
      .json({ status: true, message: "Issue purchased successfully", issue });
  } catch (error) {
    console.error("Error purchasing issue:", error);
    res.json({ status: false, message: "Server error during purchase" });
  }
};

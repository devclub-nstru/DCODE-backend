import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    labels: {
      type: Array,
      required: false,
      default: ["assignment-available"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    githubUsername: {
      type: String,
      required: false,
    },
    purchasedUserId: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", IssueSchema);

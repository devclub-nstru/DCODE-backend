import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stats: {
      type: Array,
      required: true,
      default: [
        {
          icon: "repo",
          value: 0,
          label: "Issues Created",
        },
        {
          icon: "git-branch",
          value: 0,
          label: "Pull Requests",
        },
        {
          icon: "gift",
          value: 0,
          label: "Mystery Boxes",
        },
      ],
    },
    issues: [
      {
        title: String,
        tag: String,
        date: Date,
        status: {
          type: String,
          enum: ["assigned", "completed", "in-progress"],
        },
      },
    ],
    pullRequests: [
      {
        title: String,
        tag: String,
        date: Date,
        status: {
          type: String,
          enum: ["open", "merged", "closed"],
        },
      },
    ],
    mysteryBoxes: [
      {
        id: String,
        name: String,
        rarity: String,
        unopened: Boolean,
        reward: String,
      },
    ],
    achievements: {
      type: Array,
      required: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isGoogleAccount: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    dCoins: { type: Number, default: 0 },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

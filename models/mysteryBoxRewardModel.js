import mongoose from "mongoose";

const mysteryBoxRewardSchema = new mongoose.Schema({
  boxId: {
    type: String,
    required: true,
    unique: true,
  },
  dCoinsReward: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("MysteryBoxReward", mysteryBoxRewardSchema);

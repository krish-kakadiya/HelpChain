// models/vote.model.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      required: true,
    },

    value: {
      type: Number, // 1 or -1
      enum: [1, -1],
      required: true,
    },
  },
  { timestamps: true }
);

// One user can vote once per answer
voteSchema.index({ user: 1, answer: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
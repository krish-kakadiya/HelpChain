import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },

    body: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    votes: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
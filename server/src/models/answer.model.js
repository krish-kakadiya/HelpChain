import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  body: String,
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },

  // ✅ ADD THIS
  voters: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      value: {
        type: Number, // +1 or -1
        enum: [1, -1]
      }
    }
  ],

  isAccepted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;

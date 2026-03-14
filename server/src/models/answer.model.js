import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    body : {
        type: String,
        required: true
    },
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
    isAccepted: {
        type: Boolean,
        default: false
    }
}, 
{ timestamps: true });

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;

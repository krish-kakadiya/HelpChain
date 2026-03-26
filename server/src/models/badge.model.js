import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    minPoints: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      default: "Trophy",
    },
  },
  { timestamps: true }
);

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;

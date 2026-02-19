import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 15,
      max: 100,
    },
    graduation: {
      type: String,
      required: true,
      trim: true,
    },
    github: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    technologies: {
      type: [String],
      required: true,
    },
    techStacks: {
      type: [String],
      required: true,
    },
    profilePhoto: {
      type: String, // Cloudinary URL
      default: "",
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
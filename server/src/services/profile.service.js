import fs from "fs";
import Profile  from "../models/profile.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createProfileService = async (body, file, userId) => {
  try {
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: userId });

    if (existingProfile) {
      throw new Error("Profile already exists for this user");
    }

    let imageUrl = "";

    if (file) {
      try {
        const result = await uploadToCloudinary(file.path);
        imageUrl = result.secure_url;
      } finally {
        fs.unlink(file.path, () => {});
      }
    }

    const profile = await Profile.create({
      user: userId,
      name: body.name,
      age: body.age,
      graduation: body.graduation,
      github: body.github,
      linkedin: body.linkedin,
      technologies: body.technologies
        ? JSON.parse(body.technologies)
        : [],
      techStacks: body.techStacks
        ? JSON.parse(body.techStacks)
        : [],
      profilePhoto: imageUrl,
    });

    return profile;

  } catch (error) {
    throw new Error(error.message);
  }
};

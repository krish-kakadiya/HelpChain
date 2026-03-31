import fs from "fs";
import Profile from "../models/profile.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";


// ✅ CREATE PROFILE
export const createProfileService = async (body, file, userId) => {
  try {
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

    await User.findByIdAndUpdate(userId, {
      isProfileCompleted: true,
    });

    return profile;

  } catch (error) {
    throw new Error(error.message);
  }
};



// ✅ UPDATE PROFILE (🔥 THIS IS WHAT YOU NEED)
export const updateProfileService = async (body, file, userId) => {
  try {
    const existingProfile = await Profile.findOne({ user: userId });

    if (!existingProfile) {
      throw new Error("Profile not found");
    }

    let imageUrl = existingProfile.profilePhoto; // keep old image

    if (file) {
      try {
        const result = await uploadToCloudinary(file.path);
        imageUrl = result.secure_url;
      } finally {
        fs.unlink(file.path, () => {});
      }
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
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
      },
      { new: true }
    );

    return updatedProfile;

  } catch (error) {
    throw new Error(error.message);
  }
};



// ✅ GET PROFILE
export const getProfileService = async (userId) => {
  try {
    const profile = await Profile.findOne({ user: userId })
      .populate("user", "email username");

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;

  } catch (error) {
    throw new Error(error.message);
  }
};
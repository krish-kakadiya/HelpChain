import {
  createProfileService,
  getProfileService,
  updateProfileService
} from "../services/profile.service.js";


// ✅ CREATE PROFILE
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await createProfileService(
      req.body,
      req.file,
      userId
    );

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ UPDATE PROFILE (🔥 NEW)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await updateProfileService(
      req.body,
      req.file,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET PROFILE
export const getProfile = async (req, res) => {
  try {
    console.log("Get Profile Controller");

    const userId = req.user.userId;

    const profile = await getProfileService(userId);

    res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
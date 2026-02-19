import { createProfileService } from "../services/profile.service.js";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // comes from JWT middleware
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

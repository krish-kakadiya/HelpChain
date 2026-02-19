import dotenv from "dotenv";
dotenv.config();
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "helpchain",
      timeout: 60000,
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" },
      ],
    });

    return result;

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error; // 🔥 VERY IMPORTANT
  }
};

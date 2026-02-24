import express from "express";
import upload from "../middlewares/multer.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { createProblem } from "../controller/problem.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import fs from "fs";

const router = express.Router();

router.post("/",auth,createProblem);

router.post("/upload",upload.single("image"),async (req, res) => {
    try {
      const result = await uploadToCloudinary(req.file.path);

      // 🔥 Delete local file after successful upload
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      res.json({
        success: true,
        url: result.secure_url,
      });

    } catch (error) {

      // 🔥 Delete local file if upload fails
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }

      res.status(500).json({
        message: "Error uploading file",
        error: error.message,
      });
    }
  }
);

export default router;
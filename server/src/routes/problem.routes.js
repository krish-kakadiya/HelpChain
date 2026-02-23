import express from "express";
import upload from "../middlewares/multer.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { createProblem } from "../controller/problem.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",auth,createProblem);

router.post("/upload",upload.single("image"),async (req,res) =>{
    try {
        const result = await uploadToCloudinary(req.file.path);
        res.json({
            success: true,
            url: result.secure_url
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading file", error: error.message });
    }
});

export default router;
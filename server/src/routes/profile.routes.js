import express from "express";
import { createProfile, getProfile, updateProfile } from "../controller/profile.controller.js";
import upload from "../middlewares/multer.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",auth,upload.single("profilePhoto"),createProfile);
router.get("/getProfile",auth,getProfile);
router.put("/update", auth, upload.single("profilePhoto"),updateProfile);

export default router;
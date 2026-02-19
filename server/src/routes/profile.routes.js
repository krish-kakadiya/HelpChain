import express from "express";
import { createProfile } from "../controller/profile.controller.js";
import upload from "../middlewares/multer.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",auth,upload.single("profilePhoto"),createProfile);

export default router;
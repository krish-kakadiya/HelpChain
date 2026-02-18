import express from "express";
import { register, login, verifyOtp, getMe } from "../controller/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/me", auth, getMe);

export default router;

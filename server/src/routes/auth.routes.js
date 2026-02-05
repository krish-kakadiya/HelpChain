import express from "express";
import { register, login, logout } from "../controller/auth.controller.js";
import { auth, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);

// Protected route example
router.get("/admin", auth, authorize("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin!" });
});

export default router;

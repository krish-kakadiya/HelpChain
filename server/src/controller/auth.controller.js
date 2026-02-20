import { registerService, loginService, verifyOtpService, getMeservices } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    console.log("register controller");
    console.log(req.body);
    const user = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    })
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("login controller");
    const data = await loginService(req.body);
    console.log("login controller data:", data);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const data = await verifyOtpService(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getMeservices(req.user.userId);
    res.status(200).json(user);
  }
  catch (err) {
    res.status(400).json({ error: err.message });
  }
}
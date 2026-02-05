import { registerService, loginService, logoutService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    console.log("register controller");
    const user = await registerService(req.body);
    res.status(201).json({ msg: "Registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("login controller");
    const data = await loginService(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  await logoutService(token);
  res.json({ msg: "Logged out" });
};

import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { redis } from "../config/redis.js";
import { createAccessToken, createRefreshToken } from "../utils/token.util.js";

export const registerService = async ({ email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");
  console.log("creating user")
  const user = await User.create({ email, password });
  if(!user) throw new Error("Error creating user");
  console.log("user created")
  return user;
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await user.comparePassword(password);
  if (!valid) throw new Error("Invalid credentials");

  // Create tokens
  const accessToken = createAccessToken(user._id, user.role);
  const refreshToken = createRefreshToken(user._id);

  // Store hashed refresh token in DB
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return { accessToken, refreshToken };
};

export const logoutService = async (token) => {
  await redis.set(token, "blacklisted", { EX: 60 * 60 * 24 });
};

export const refreshTokenService = async (token) => {
  const user = await User.findOne({});

  // check incoming token with the hashed stored token
};

import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { createAccessToken, createRefreshToken } from "../utils/token.util.js";
import Otp from "../models/otp.model.js";
import sendEmail from "../utils/sendEmail.js";

export const verifyOtpService = async ({ email, otp }) => {
 
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  
  if (user.isVerified) {
    throw new Error("User already verified");
  }

  const otpRecord = await Otp.findOne({ userId: user._id });

  if (!otpRecord) {
    throw new Error("OTP not found. Please request a new one.");
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteMany({ userId: user._id }); // cleanup
    throw new Error("OTP expired. Please request a new one.");
  }


  const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);

  if (!isMatch) {
    throw new Error("Invalid OTP");
  }

  // 6️⃣ Mark user verified
  user.isVerified = true;
  await user.save();

  await Otp.deleteMany({ userId: user._id });

  return {
    message: "Email verified successfully",
  };
};

export const registerService = async ({ username, email, password }) => {
  console.log("register service");
  const existingUser = await User.findOne({email});

  if(existingUser && existingUser.isVerified) 
  {
    throw new Error("Email is already in use");
  }
  let user;
  if(!existingUser)
  {
    user = await User.create({
      username,
      email,
      password
    })
  }
  else
  {
    user = existingUser;
  }
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const otpHash = await bcrypt.hash(otp,10);

  await Otp.deleteMany({userId: user._id});

  await Otp.create({
    userId: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  })
  
  await sendEmail(email,otp);

  return {
    sucssess: true,
    message: "OTP sent to email",
  }

};

export const loginService = async ({ email, password }) => {

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const valid = await user.comparePassword(password);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
  
  return {
    accessToken,
    refreshToken,
  };
};



export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (err) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user || !user.refreshTokenHash) {
    throw new Error("Unauthorized");
  }

  // Compare refresh token with hash
  const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);

  if (!isMatch) {
    throw new Error("Invalid refresh token");
  }

  // Generate new tokens (rotation)
  const newAccessToken = createAccessToken(user._id);
  const newRefreshToken = createRefreshToken(user._id);

  // Hash new refresh token
  const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

  user.refreshTokenHash = newRefreshTokenHash;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const getMeservices = async (userId) => {
  const user  = await User.findById(userId).select("-password -refreshTokenHash");

  if(!user){
    throw new Error("User not found");
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  }
}

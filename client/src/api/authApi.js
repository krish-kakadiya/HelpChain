import api from "./axios";

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const verifyOtp = (data) => {
  return api.post("/auth/verify-otp", data);
};

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const getMe = () => {
  return api.get("/auth/me");
};

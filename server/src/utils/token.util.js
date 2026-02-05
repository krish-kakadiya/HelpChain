import jwt from "jsonwebtoken";

export const createAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_SECRET, {
    expiresIn: "15m"
  });
};

export const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d"
  });
};

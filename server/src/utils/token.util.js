import jwt from "jsonwebtoken";

export const createAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_SECRET, {
    expiresIn: "1d"
  });
};

export const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d"
  });
};

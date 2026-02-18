import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    console.log("Decoded user:", req.user);
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};


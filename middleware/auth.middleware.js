import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../model/user.js";

export const authorise = async (req, res, next) => {
  try {
    let token;

    // 🔥 Check cookies first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // 🔥 Check Authorization header if cookie is missing
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token is found, return 401
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Fetch user
    const user = await User.findById(decoded.userId);
    console.log("Authenticated User:", user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

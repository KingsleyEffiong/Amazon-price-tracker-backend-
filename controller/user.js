import mongoose from "mongoose";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const signup = async (req, res, next) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [{ username, email, password: hashedPassword }],
      {
        session,
      }
    );

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }
    next(error);
  }
};
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Fix: Properly set the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 🔥 Change to `true` only in production (HTTPS)
      sameSite: "None", // ✅ `None` is required only for cross-site
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: { token, user },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const sigout = async (req, res, next) => {};

export const getUser = async (req, res) => {
  try {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET); // Decode token
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ success: true, user }); // Return user details
  } catch (error) {
    console.error("GetUser Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

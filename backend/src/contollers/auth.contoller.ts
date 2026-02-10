import express, { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const createAccout = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(401)
        .json({ success: false, message: "please fill all input" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 6 || password.length > 12) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 6 and 12 characters",
      });
    }

    const isEmail = await User.findOne({ email });

    if (isEmail) {
      return res.status(400).json({ success: false, message: "email is busy" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        userId: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "User success created",
      data: {
        id: createdUser._id,
        name: name.toLowerCase(),
        email: email,
        role: token,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const lowerCaseEmail = email.toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: lowerCaseEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect" });
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "JWT_SECRET not configured" });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Return user without password
    const safeUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: safeUser,
      token,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error from login",
    });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findUser = await User.findById(id);
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "user deleted" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal serrver error from delete account",
    });
  }
};

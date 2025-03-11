// controllers/auth/authController.js
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateEmail } from "../../utils/emailValidator.js"; // If you have this utility

/**
 * SIGNUP
 * Registers a new user (patient/doctor) with additional profile fields.
 */
export const signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role, // typically "patient" or "doctor"
      hostelName,
      roomNo,
      branch,
      section,
      gender,
      contact,
    } = req.body;

    // 1. Validate SRMAP email domain
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "Email must be from srmap.edu.in" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user with the provided fields
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      hostelName,
      roomNo,
      branch,
      section,
      gender,
      contact,
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 6. Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostelName: user.hostelName,
        roomNo: user.roomNo,
        branch: user.branch,
        section: user.section,
        gender: user.gender,
        contact: user.contact,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * LOGIN
 * Authenticates a user with email and password.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 4. Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostelName: user.hostelName,
        roomNo: user.roomNo,
        branch: user.branch,
        section: user.section,
        gender: user.gender,
        contact: user.contact,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

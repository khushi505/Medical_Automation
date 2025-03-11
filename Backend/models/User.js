// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },
    // Additional profile fields
    hostelName: {
      type: String,
      default: "",
    },
    roomNo: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    section: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

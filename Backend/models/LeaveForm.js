// models/LeaveForm.js
import mongoose from "mongoose";

const LeaveFormSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    reportFile: {
      type: String, // This could be a filename or GridFS file ID
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LeaveForm", LeaveFormSchema);

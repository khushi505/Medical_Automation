// controllers/doctor/profileController.js
import User from "../../models/User.js";

const DOCTOR_DETAILS = {
  "venkataabhinay.t@srmap.edu.in": {
    experience: "5 years",
    specialization: "General Medicine",
    workingDays: "Mon - Fri",
    timeSlot: "9 AM - 5 PM",
  },
  "sabeehafarheen.s@srmap.edu.in": {
    experience: "3 years",
    specialization: "Pediatrics",
    workingDays: "Mon - Sat",
    timeSlot: "10 AM - 4 PM",
  },
  "raju.du@srmap.edu.in": {
    experience: "7 years",
    specialization: "Orthopedics",
    workingDays: "Mon - Thurs",
    timeSlot: "8 AM - 2 PM",
  },
};

export const getDoctorProfile = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    const doctor = req.user; // from the DB (name, email, role, etc.)

    // If the doctor's email is in our dictionary, merge the extra details
    const extra = DOCTOR_DETAILS[doctor.email] || {};

    // Merge the user doc with the extra fields
    const augmentedDoctor = {
      ...doctor.toObject(), // if doctor is a Mongoose doc, convert it
      experience: extra.experience || "",
      specialization: extra.specialization || "",
      workingDays: extra.workingDays || "",
      timeSlot: extra.timeSlot || "",
    };

    res.status(200).json({ doctor: augmentedDoctor });
  } catch (error) {
    next(error);
  }
};

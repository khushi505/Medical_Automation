// controllers/doctor/profileController.js
import User from "../../models/User.js";

// Get the doctor’s profile (the logged-in user)
export const getDoctorProfile = async (req, res, next) => {
  try {
    // Assuming req.user is set by the auth middleware
    res.status(200).json({ doctor: req.user });
  } catch (error) {
    next(error);
  }
};

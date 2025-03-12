// controllers/doctor/appointmentController.js
import Appointment from "../../models/Appointment.js";

// Get new (pending) appointments for the logged-in doctor
export const getNewAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      status: "Pending",
    })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
};

// Update the status of an appointment (Accept or Reject)
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { appointmentId, status } = req.body; // status should be "Accepted" or "Rejected"
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointmentId, status: "Pending" },
      { status, doctor: req.user._id },
      { new: true }
    );
    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found or not assigned to you" });
    }
    res
      .status(200)
      .json({ message: "Appointment status updated", updatedAppointment });
  } catch (error) {
    next(error);
  }
};

// Add a prescription to an accepted appointment
export const addPrescription = async (req, res, next) => {
  try {
    const { appointmentId, prescriptionText } = req.body;
    // Create a Prescription document (see Prescription model)
    // This code assumes you have a Prescription model similar to:
    // { appointmentId: String, doctor: ObjectId, prescriptionText: String }
    const Prescription = (await import("../../models/Prescription.js")).default;
    const prescription = await Prescription.create({
      appointmentId,
      doctor: req.user._id,
      prescriptionText,
    });
    res.status(201).json({ message: "Prescription added", prescription });
  } catch (error) {
    next(error);
  }
};

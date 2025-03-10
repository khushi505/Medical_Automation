// controllers/patientController.js
import Appointment from "../models/Appointment.js";
import LeaveForm from "../models/LeaveForm.js";
import * as appointmentService from "../services/appointmentService.js";

export const getProfile = async (req, res, next) => {
  try {
    // Assuming user info is attached to req.user by authMiddleware
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, details } = req.body;
    // Generate unique appointment ID using appointmentService
    const appointmentId = await appointmentService.generateAppointmentId(
      appointmentDate
    );

    const appointment = await Appointment.create({
      appointmentId,
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate,
      details,
      status: "Pending",
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    next(error);
  }
};

export const submitLeaveForm = async (req, res, next) => {
  try {
    // Assuming file is handled by multer middleware and stored in req.file
    const { reason } = req.body;
    const leaveForm = await LeaveForm.create({
      patient: req.user._id,
      reason,
      reportFile: req.file.filename, // For GridFS integration, store file id instead
      status: "Pending",
    });
    res.status(201).json({ message: "Leave form submitted", leaveForm });
  } catch (error) {
    next(error);
  }
};

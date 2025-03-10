// controllers/doctorController.js
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import LeaveForm from "../models/LeaveForm.js";

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ doctor: req.user });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id });
    res.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { appointmentId, status } = req.body; // status: 'Accepted' or 'Rejected'
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { status },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Appointment status updated", appointment });
  } catch (error) {
    next(error);
  }
};

export const addPrescription = async (req, res, next) => {
  try {
    const { appointmentId, prescriptionText } = req.body;
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

export const getLeaveForms = async (req, res, next) => {
  try {
    // This can be modified based on how you assign leave forms to doctors
    const leaveForms = await LeaveForm.find({});
    res.status(200).json({ leaveForms });
  } catch (error) {
    next(error);
  }
};

export const updateLeaveFormStatus = async (req, res, next) => {
  try {
    const { leaveFormId, status } = req.body; // status: 'Approved' or 'Rejected'
    const leaveForm = await LeaveForm.findByIdAndUpdate(
      leaveFormId,
      { status },
      { new: true }
    );
    res.status(200).json({ message: "Leave form status updated", leaveForm });
  } catch (error) {
    next(error);
  }
};

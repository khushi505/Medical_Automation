import Appointment from "../../models/Appointment.js";
import HistoryAppointment from "../../models/historyAppointment.js";
import Prescription from "../../models/Prescription.js";
import * as appointmentService from "../../services/appointmentService.js";
import mongoose from "mongoose";

// ✅ Get all appointments (including history) for the patient
export const getAppointments = async (req, res) => {
  try {
    // 1. Fetch current and historical appointments
    const currentAppointments = await Appointment.find({
      patient: req.user._id,
    })
      .populate("doctor", "name email")
      .populate({
        path: "prescription",
        select: "prescriptionText doctor",
        options: { strictPopulate: false }, // Avoid errors if prescription does not exist
      })
      .sort({ createdAt: -1 });

    const historicalAppointments = await HistoryAppointment.find({
      patient: req.user._id,
    })
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    // 2. Merge both current and historical appointments
    const allAppointments = [...currentAppointments, ...historicalAppointments];

    // 3. Collect appointment IDs
    const appointmentIds = allAppointments.map((appt) => appt._id.toString()); // Use `_id` to avoid undefined values

    // 4. Fetch prescriptions linked to these appointments
    const prescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds },
    }).populate("doctor", "name email");

    // 5. Map prescriptions by appointmentId
    const presByAppt = {};
    prescriptions.forEach((p) => {
      presByAppt[p.appointmentId.toString()] = p;
    });

    // 6. Attach prescription data to each appointment
    const appointmentsWithPres = allAppointments.map((appt) => ({
      ...appt.toObject(),
      prescription: presByAppt[appt._id.toString()] || null, // Ensure proper mapping
    }));

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments: appointmentsWithPres,
    });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching appointments" });
  }
};

// ✅ Book a new appointment
export const bookAppointment = async (req, res) => {
  try {
    const { appointmentDate, details, doctorId } = req.body;

    // Generate a unique appointmentId
    const appointmentId = await appointmentService.generateAppointmentId(
      appointmentDate
    );

    // Create appointment with default status = "Pending"
    const appointment = await Appointment.create({
      appointmentId,
      patient: req.user._id,
      doctor: doctorId || null,
      appointmentDate,
      details,
      status: "Pending",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error while booking appointment" });
  }
};

// ✅ Update appointment status ("Accepted" or "Rejected")
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { status },
      { new: true }
    ).populate("patient", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: `Appointment ${status.toLowerCase()} successfully`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
};

// ✅ Add a prescription
export const addPrescription = async (req, res, next) => {
  try {
    const { appointmentId, prescriptionText } = req.body;

    if (!appointmentId || !prescriptionText) {
      return res
        .status(400)
        .json({ message: "Missing appointmentId or prescription" });
    }

    // Fetch the appointment to get patient information
    const appointment = await Appointment.findOne({ appointmentId }).populate(
      "patient",
      "name _id"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (!appointment.patient || !appointment.patient._id) {
      return res
        .status(400)
        .json({ message: "Patient information is missing in appointment" });
    }

    const patientId = appointment.patient._id;

    // Save the prescription in the Prescription model
    const prescriptionDoc = await Prescription.create({
      appointmentId: appointment._id, // Ensure the correct ID format
      patient: patientId,
      doctor: req.user._id,
      prescription: prescriptionText,
    });

    // Link the new Prescription to the Appointment document
    await Appointment.findByIdAndUpdate(
      appointment._id, // Using _id instead of appointmentId
      { $set: { prescription: prescriptionDoc._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Prescription added successfully",
      prescription: prescriptionDoc,
    });
  } catch (error) {
    console.error("Error adding prescription:", error);
    next(error);
  }
};

// controllers/patient/appointmentsController.js
import Appointment from "../../models/Appointment.js";
import Prescription from "../../models/Prescription.js";
import * as appointmentService from "../../services/appointmentService.js";

// Get all appointments (history) for the patient
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    // Optionally, attach prescriptions
    const appointmentIds = appointments.map((appt) => appt.appointmentId);
    const prescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds },
    });

    const presByAppt = {};
    prescriptions.forEach((p) => {
      if (!presByAppt[p.appointmentId]) {
        presByAppt[p.appointmentId] = [];
      }
      presByAppt[p.appointmentId].push(p);
    });

    const appointmentsWithPres = appointments.map((appt) => ({
      ...appt.toObject(),
      prescriptions: presByAppt[appt.appointmentId] || [],
    }));

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments: appointmentsWithPres,
    });
  } catch (error) {
    next(error);
  }
};

// Book a new appointment (slot)
export const bookAppointment = async (req, res, next) => {
  try {
    // 1. Extract doctorId from the request body
    const { appointmentDate, details, doctorId } = req.body;

    // 2. Generate a unique appointmentId (e.g., ddmmyyyy-01)
    const appointmentId = await appointmentService.generateAppointmentId(
      appointmentDate
    );

    // 3. Create the appointment with status "Pending"
    //    Assign the "doctor" field to doctorId (if provided)
    const appointment = await Appointment.create({
      appointmentId,
      patient: req.user._id,
      doctor: doctorId || null, // If doctorId is missing, it remains null
      appointmentDate,
      details,
      status: "Pending",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

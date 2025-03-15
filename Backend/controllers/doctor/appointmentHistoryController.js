// controllers/doctor/appointmentHistoryController.js
import Appointment from "../../models/Appointment.js";
import HistoryAppointment from "../../models/historyAppointment.js"; // NEW: Import HistoryAppointment Model
import Prescription from "../../models/Prescription.js";

export const getAppointmentHistory = async (req, res, next) => {
  try {
    // Fetch all appointments for the logged-in doctor (both current and historical)
    const currentAppointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    const historicalAppointments = await HistoryAppointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    // Merge current and historical appointments
    const allAppointments = [...currentAppointments, ...historicalAppointments];

    // Extract appointmentId values from these appointments
    const appointmentIds = allAppointments.map((a) => a.appointmentId);

    // Fetch prescriptions for these appointments
    const prescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds },
    });

    // Group prescriptions by appointmentId
    const presByAppt = {};
    prescriptions.forEach((p) => {
      if (!presByAppt[p.appointmentId]) {
        presByAppt[p.appointmentId] = [];
      }
      presByAppt[p.appointmentId].push(p);
    });

    // Attach prescriptions to each appointment
    const appointmentsWithPrescriptions = allAppointments.map((appt) => ({
      ...appt.toObject(),
      prescriptions: presByAppt[appt.appointmentId] || [],
    }));

    res.status(200).json({ appointments: appointmentsWithPrescriptions });
  } catch (error) {
    next(error);
  }
};

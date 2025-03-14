// controllers/doctor/appointmentHistoryController.js
import Appointment from "../../models/Appointment.js";
import Prescription from "../../models/Prescription.js";

export const getAppointmentHistory = async (req, res, next) => {
  try {
    // Fetch all appointments for the logged-in doctor (regardless of status)
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    // Retrieve prescriptions for these appointments
    const appointmentIds = appointments.map((a) => a.appointmentId);
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
    const appointmentsWithPrescriptions = appointments.map((appt) => ({
      ...appt.toObject(),
      prescriptions: presByAppt[appt.appointmentId] || [],
    }));

    res.status(200).json({ appointments: appointmentsWithPrescriptions });
  } catch (error) {
    next(error);
  }
};

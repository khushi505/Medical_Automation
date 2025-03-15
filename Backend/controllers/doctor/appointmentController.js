import Appointment from "../../models/Appointment.js";
import Prescription from "../../models/Prescription.js"; // Import Prescription Model

// ✅ Get new (pending) appointments for the logged-in doctor
export const getNewAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ status: "Pending" })
      .populate("patient", "name email") // Get patient name and email
      .sort({ createdAt: -1 });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching new appointments:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching appointments" });
  }
};

// ✅ Update the status of an appointment (Accept or Reject)
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { appointmentId, status } = req.body;

    if (!appointmentId || !status) {
      return res
        .status(400)
        .json({ message: "Missing appointmentId or status" });
    }

    // Update appointment status and assign the doctor
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointmentId, status: "Pending" }, // Only update if status is "Pending"
      { status, doctor: req.user._id }, // Assign doctor and update status
      { new: true }
    ).populate("patient", "name email");

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found or already updated" });
    }

    res.status(200).json({
      message: `Appointment ${status.toLowerCase()} successfully`,
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating appointment status" });
  }
};

// ✅ Add a prescription to an accepted appointment
export const addPrescription = async (req, res, next) => {
  try {
    const { appointmentId, prescription } = req.body;

    if (!appointmentId || !prescription) {
      return res
        .status(400)
        .json({ message: "Missing appointmentId or prescription" });
    }

    // Ensure the appointment is accepted before adding a prescription
    const appointment = await Appointment.findOne({
      appointmentId,
      status: "Accepted",
    });

    if (!appointment) {
      return res
        .status(400)
        .json({ message: "Only accepted appointments can have prescriptions" });
    }

    // Save prescription in the database
    const prescriptionDoc = await Prescription.create({
      appointmentId,
      doctor: req.user._id,
      prescription,
    });

    // Update appointment with prescription reference
    await Appointment.findOneAndUpdate(
      { appointmentId },
      { prescription: prescriptionDoc.prescription },
      { new: true }
    );

    res.status(201).json({
      message: "Prescription added successfully",
      prescription: prescriptionDoc,
    });
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(500).json({ message: "Server error while adding prescription" });
  }
};

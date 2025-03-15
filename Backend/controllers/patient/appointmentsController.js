import Appointment from "../../models/Appointment.js";
import Prescription from "../../models/Prescription.js";
import * as appointmentService from "../../services/appointmentService.js";

// Get all appointments (history) for the patient
export const getAppointments = async (req, res) => {
  try {
    // 1. Find all appointments for this patient
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name email")
      .populate("prescription")
      .sort({ createdAt: -1 });

    // 2. Collect appointment IDs (the custom string, e.g. "15032025-12")
    const appointmentIds = appointments.map((appt) => appt.appointmentId);

    // 3. Fetch prescriptions linked to these appointments
    const prescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds },
    }).populate("doctor", "name email");

    // 4. Map prescriptions by appointmentId
    const presByAppt = {};
    prescriptions.forEach((p) => {
      presByAppt[p.appointmentId] = p;
    });

    // 5. Attach prescription data to each appointment
    const appointmentsWithPres = appointments.map((appt) => {
      // The doctor name is appt.doctor.name if populated, else "Unknown"
      const docName = appt.doctor ? appt.doctor.name : "Unknown";
      // Match by appointmentId, not the Mongo _id
      const prescriptionDoc = presByAppt[appt.appointmentId] || null;

      return {
        ...appt.toObject(),
        doctor: docName,
        prescription: prescriptionDoc, // entire prescription doc or null
      };
    });

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

// Book a new appointment (slot)
export const bookAppointment = async (req, res) => {
  try {
    const { appointmentDate, details, doctorId } = req.body;

    // Generate a unique appointmentId (e.g. "15032025-12")
    const appointmentId = await appointmentService.generateAppointmentId(
      appointmentDate
    );

    // Create appointment with default status = "Pending"
    const appointment = await Appointment.create({
      appointmentId,
      patient: req.user._id,
      doctor: doctorId || null, // can be null if no doctor chosen
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

// Update appointment status ("Accepted" or "Rejected")
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

export const addPrescription = async (req, res, next) => {
  try {
    const { appointmentId, prescriptionText } = req.body;

    // Ensure both fields are provided
    if (!appointmentId || !prescriptionText) {
      return res
        .status(400)
        .json({ message: "Missing appointmentId or prescription" });
    }

    // Fetch the appointment to get the patient's information
    const appointment = await Appointment.findOne({ appointmentId }).populate(
      "patient",
      "name _id"
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (!appointment.patient || !appointment.patient._id) {
      return res.status(400).json({
        message: "Patient information is missing in appointment",
      });
    }

    // Retrieve the patient's ObjectId from the appointment
    const patientId = appointment.patient._id;

    // Create the Prescription document, saving prescriptionText into the field named "prescription"
    const prescriptionDoc = await Prescription.create({
      appointmentId,
      patient: patientId, // include patient reference if needed
      doctor: req.user._id,
      prescription: prescriptionText,
    });

    // Link the new Prescription's _id to the Appointment document
    await Appointment.findOneAndUpdate(
      { appointmentId },
      { prescription: prescriptionDoc._id },
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

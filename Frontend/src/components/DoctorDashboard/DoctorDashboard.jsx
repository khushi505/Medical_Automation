import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DoctorSidebar from "./DoctorSidebar/DoctorSidebar";
import DoctorProfile from "./DoctorProfile/DoctorProfile";
import DoctorAppointments from "./Appointments/DoctorAppointments"; // UI-only component
import AppointmentHistory from "./History/AppointmentHistory";
import DoctorLeaveApproval from "./LeaveApproval/DoctorLeaveApproval";
import Contact from "./Conatact/Contactsrm";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  // State to hold doctor profile data
  const [doctorData, setDoctorData] = useState({
    name: "",
    specialization: "",
    experience: "",
    workingDays: "",
    timeSlot: "",
  });

  // State for appointment statistics (optional)
  const [statsData, setStatsData] = useState({
    totalAppointments: 0,
    acceptedAppointments: 0,
    pendingAppointments: 0,
  });

  // Pending appointments
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState({}); // For prescription text, keyed by appointmentId
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Appointment history
  const [historyAppointments, setHistoryAppointments] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully.");
    window.location.href = "/login"; // Redirect to login page
  };

  // Fetch doctor profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please log in again.");
      handleLogout(); // Redirect user or clear session
      return;
    }

    axios
      .get("http://localhost:5000/api/doctor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const doctor = response.data.doctor;
        setDoctorData({
          name: doctor.name || "",
          specialization: doctor.specialization || "",
          experience: doctor.experience || "",
          workingDays: doctor.workingDays || "",
          timeSlot: doctor.timeSlot || "",
        });
        // Optionally update statsData if you have a stats endpoint or placeholders
        setStatsData({
          totalAppointments: 10,
          acceptedAppointments: 6,
          pendingAppointments: 4,
        });
      })
      .catch((error) => {
        console.error("Error fetching doctor profile:", error);
      });
  }, []);

  // Fetch pending appointments on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/doctor/appointments/new", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAppointments(res.data.appointments);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        toast.error("Error fetching pending appointments");
      });
  }, []);

  // Function to fetch appointment history
  const fetchAppointmentHistory = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("http://localhost:5000/api/doctor/appointments/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHistoryAppointments(res.data.appointments);
      })
      .catch((err) => {
        console.error("Error fetching appointment history:", err);
        toast.error("Error fetching appointment history");
      });
  };

  // Fetch appointment history on mount
  useEffect(() => {
    fetchAppointmentHistory(); // loads doctor history initially
  }, [appointments]);

  // Handler: Accept an appointment
  const handleAccept = async (appointmentId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:5000/api/doctor/appointments/update",
        { appointmentId, status: "Accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment accepted");

      // Mark appointment as accepted so that prescription input can be shown
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentId === appointmentId
            ? { ...apt, status: "Accepted" }
            : apt
        )
      );
      setSelectedAppointment(appointmentId);

      // Re-fetch history so it appears in the doctor's history tab
      fetchAppointmentHistory();
    } catch (error) {
      console.error("Error accepting appointment:", error);
      toast.error("Failed to accept appointment");
    }
  };

  // Handler: Reject an appointment
  const handleReject = async (appointmentId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:5000/api/doctor/appointments/update",
        { appointmentId, status: "Rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment rejected");

      // Remove appointment from pending list
      setAppointments((prev) =>
        prev.filter((apt) => apt.appointmentId !== appointmentId)
      );

      // Re-fetch history so the newly rejected appointment is in history
      fetchAppointmentHistory();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast.error("Failed to reject appointment");
    }
  };

  // Handler: Prescription change for a given appointment
  const handlePrescriptionChange = (appointmentId, value) => {
    setPrescriptions((prev) => ({ ...prev, [appointmentId]: value }));
  };

  // Handler: Add prescription and finalize acceptance
  const handleAddPrescription = async (appointmentId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const prescriptionText = prescriptions[appointmentId];
      await axios.post(
        "http://localhost:5000/api/doctor/appointments/prescription",
        { appointmentId, prescription: prescriptionText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Prescription added; appointment finalized as accepted");

      // Remove the appointment from pending list
      setAppointments((prev) =>
        prev.filter((apt) => apt.appointmentId !== appointmentId)
      );

      // Clear prescription input for that appointment
      setPrescriptions((prev) => {
        const newPrescriptions = { ...prev };
        delete newPrescriptions[appointmentId];
        return newPrescriptions;
      });
      setSelectedAppointment(null);

      // Re-fetch history so that accepted w/ prescription shows up
      fetchAppointmentHistory();
    } catch (error) {
      console.error("Error adding prescription:", error);
      toast.error("Failed to add prescription");
    }
  };

  return (
    <div className="doctor-dashboard-container">
      <DoctorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="doctor-main-content">
        {activeTab === "profile" && (
          <DoctorProfile doctor={doctorData} stats={statsData} />
        )}
        {activeTab === "appointments" && (
          <DoctorAppointments
            appointments={appointments}
            prescriptions={prescriptions}
            onAccept={handleAccept}
            onReject={handleReject}
            onPrescriptionChange={handlePrescriptionChange}
            onAddPrescription={handleAddPrescription}
            selectedAppointment={selectedAppointment}
          />
        )}
        {activeTab === "history" && (
          <AppointmentHistory appointments={historyAppointments} />
        )}
        {activeTab === "leave" && <DoctorLeaveApproval />}
        {activeTab === "contact" && <Contact />}
      </div>
    </div>
  );
}

export default DoctorDashboard;

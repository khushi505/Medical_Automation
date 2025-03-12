import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import ProfileSection from "./ProfileSection/ProfileSection";
import EditProfile from "./EditProfile/EditProfile";
import BookSlot from "./BookSlot/BookSlot";
import History from "./History/History";
import Contact from "./Contact/Contact";
import "./PatientDashboard.css";
import Advisory from "./Advisory/Advisory";
import LeaveForm from "./LeaveForm/LeaveForm";

function PatientDashboard() {
  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Example user data (replace with backend fetch)
  const [user, setUser] = useState({
    name: "John Doe",
    branch: "CSE",
    hostelName: "DH-2",
    roomNo: "301",
    section: "A",
    weight: "",
    height: "",
    disease: "",
    contact: "9876543210",
    email: "john.doe@srmap.edu.in",
  });

  // Appointment state (replace with backend fetch)
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    details: "",
  });

  // Edit profile data
  const [editData, setEditData] = useState({ ...user });

  // Simulated data fetching (useEffect)
  useEffect(() => {
    // TODO: Fetch user details and appointments from backend
  }, []);

  // Handlers
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setUser({ ...editData });
    alert("Profile updated successfully!");
    setActiveTab("profile");
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const newId = appointments.length + 1;
    const newApt = {
      id: newId,
      date: newAppointment.date,
      details: newAppointment.details,
      status: "Pending",
      prescription: "",
    };
    setAppointments([...appointments, newApt]);
    alert("Appointment booked successfully!");
    setNewAppointment({ date: "", details: "" });
  };

  const handleAppointmentAcceptance = (id, status) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  // Hours & Contact information for ProfileSection
  const hoursInfo = {
    opd: "8 AM to 5 PM on weekdays and 8 AM to 1 PM on Saturdays",
    emergency: "24/7 emergency services. Phone: 1800-123-4567",
    ambulance: "24/7 ambulance available",
    pharmacy: "24/7 pharmacy available",
  };

  // Logout handler
  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div className="patient-dashboard-container-new">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userName={user.name}
      />
      {/* Main content area */}
      <div className="main-content-new">
        {activeTab === "profile" && (
          <ProfileSection user={user} hoursInfo={hoursInfo} />
        )}
        {activeTab === "edit-profile" && (
          <EditProfile
            editData={editData}
            setEditData={setEditData}
            onSubmit={handleProfileUpdate}
          />
        )}
        {activeTab === "book-slot" && (
          <BookSlot
            newAppointment={newAppointment}
            setNewAppointment={setNewAppointment}
            onBook={handleBookAppointment}
            appointments={appointments}
            onSimulate={handleAppointmentAcceptance}
          />
        )}
        {activeTab === "history" && <History appointments={appointments} />}
        {/* Render Advisory below Medical History */}
        {activeTab === "advisory" && <Advisory />}
        {/* Render the LeaveForm here */}
        {activeTab === "leave" && <LeaveForm />}
        {activeTab === "contact" && <Contact />}
      </div>
    </div>
  );
}

export default PatientDashboard;

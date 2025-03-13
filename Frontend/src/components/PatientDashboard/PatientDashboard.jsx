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
import axios from "axios";

function PatientDashboard() {
  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // User state: initially empty; will be populated by backend fetch
  const [user, setUser] = useState({
    name: "",
    branch: "",
    hostelName: "",
    roomNo: "",
    section: "",
    weight: "",
    height: "",
    disease: "",
    contact: "",
    email: "",
  });

  // Appointment state (for appointments)
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    details: "",
  });

  // Edit profile data state: will be set to the fetched user details
  const [editData, setEditData] = useState({ ...user });

  // Fetch actual user details from the backend on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/patient/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const fetchedUser = response.data.user;
          setUser(fetchedUser);
          setEditData(fetchedUser);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, []);

  // Handler to update profile via backend API
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated!");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:5000/api/patient/profile",
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the user state with the updated profile from backend
      setUser(response.data.user);
      alert("Profile updated successfully!");
      setActiveTab("profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    }
  };

  // Handler to book appointment (simulated)
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

  // Handler to update appointment status (simulated)
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

  // Logout handler (dummy)
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
        {activeTab === "advisory" && <Advisory />}
        {activeTab === "leave" && <LeaveForm />}
        {activeTab === "contact" && <Contact />}
      </div>
    </div>
  );
}

export default PatientDashboard;

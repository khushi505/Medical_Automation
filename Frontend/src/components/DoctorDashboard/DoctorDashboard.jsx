import React, { useState } from "react";
import DoctorSidebar from "./DoctorSidebar/DoctorSidebar";
import DoctorProfile from "./DoctorProfile/DoctorProfile";
import DoctorAppointments from "./Appointments/DoctorAppointments";
import AppointmentHistory from "./History/AppointmentHistory";
import DoctorLeaveApproval from "./LeaveApproval/DoctorLeaveApproval";
import Contact from "./Conatact/Contactsrm";
// Optional placeholders
// import LeaveApproval from "./LeaveApproval/LeaveApproval";
// import Advisory from "./Advisory/Advisory";
// import Contact from "./Contact/Contact";

import "./DoctorDashboard.css";

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = () => {
    alert("Logging out...");
  };

  // Example doctor data
  const doctorData = {
    name: "Dr. Sabeeha Farheen Sirvella",
    specialization: "General Medicine",
    experience: "10 Years",
    workingDays: "Mon - Fri",
    timeSlot: "9 AM - 5 PM",
  };

  // Example stats data
  const statsData = {
    totalAppointments: 3,
    acceptedAppointments: 2,
    pendingAppointments: 1,
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
        {activeTab === "appointments" && <DoctorAppointments />}
        {activeTab === "history" && <AppointmentHistory />}
        {activeTab === "leave" && <DoctorLeaveApproval />}
        {activeTab === "contact" && <Contact />}
        {/* 
          if you have placeholders:
          {activeTab === "leave" && <LeaveApproval />}
          {activeTab === "advisory" && <Advisory />}
          
        */}
      </div>
    </div>
  );
}

export default DoctorDashboard;

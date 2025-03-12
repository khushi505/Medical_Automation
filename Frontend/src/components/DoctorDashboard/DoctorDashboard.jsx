import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendar, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./DoctorDashboard.css";

const API_URL = "http://localhost:5000/api"; // Adjust the API URL as needed

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescription, setPrescription] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [doctor, setDoctor] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [acceptedAppointments, setAcceptedAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const navigate = useNavigate();

  // Fetch doctor's profile and appointments from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDoctorData = async () => {
      try {
        const res = await fetch(`${API_URL}/doctor/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDoctor(data.doctor);
        } else {
          console.error("Failed to fetch doctor data");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${API_URL}/doctor/appointments`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.appointments);
          setTotalAppointments(data.appointments.length);
          setAcceptedAppointments(
            data.appointments.filter((appt) => appt.status === "Accepted")
              .length
          );
          setPendingAppointments(
            data.appointments.filter((appt) => appt.status === "Pending").length
          );
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchDoctorData();
    fetchAppointments();
  }, []);

  // Update appointment status (Accept/Reject)
  const handleUpdateStatus = async (appointmentId, status) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/doctor/appointment/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ appointmentId, status }),
      });
      if (res.ok) {
        alert(`Appointment ${status}`);
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.appointmentId === appointmentId ? { ...appt, status } : appt
          )
        );
      } else {
        alert("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  // Add prescription for a specific appointment
  const handleAddPrescription = async (appointmentId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/doctor/appointment/prescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ appointmentId, prescriptionText: prescription }),
      });
      if (res.ok) {
        alert("Prescription added");
        setPrescription("");
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.appointmentId === appointmentId
              ? { ...appt, prescriptionText: prescription }
              : appt
          )
        );
      } else {
        alert("Failed to add prescription");
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  // Update doctor's profile information
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/doctor/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          specialization: doctor.specialization,
          experience: doctor.experience,
        }),
      });
      if (res.ok) {
        alert("Profile updated successfully");
        setActiveTab("profile");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="mainpage">
      {/* Left Section for Doctor Profile */}
      <div className="left">
        <div className="Docprofile">
          <img
            src="https://srmap.edu.in/file/2019/12/White.png"
            alt="SRM AP Logo"
            className="srm-logo"
          />
          {doctor ? (
            <>
              <h4 className="doctor-name">Dr. {doctor.name}</h4>
              <ul className="nav-menu">
                <li onClick={() => setActiveTab("profile")}>
                  <FontAwesomeIcon icon={faUser} /> Profile
                </li>
                <li onClick={() => setActiveTab("appointments")}>
                  <FontAwesomeIcon icon={faCalendar} /> Appointments
                </li>
                <li onClick={() => setActiveTab("edit-profile")}>
                  <FontAwesomeIcon icon={faEdit} /> Edit Profile
                </li>
              </ul>
            </>
          ) : (
            <p>Loading doctor information...</p>
          )}
        </div>
      </div>

      {/* Logout Button - Top Right */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Right Section */}
      <div className="right">
        <div className="lekha_jokha">
          {activeTab === "profile" && (
            <>
              <div className="profile-section">
                <h4>Profile</h4>
                <p>
                  <strong>Name:</strong> {doctor?.name}
                </p>
                <p>
                  <strong>Specialization:</strong>{" "}
                  {doctor?.specialization || "N/A"}
                </p>
                <p>
                  <strong>Experience:</strong> {doctor?.experience || "N/A"}{" "}
                  Years
                </p>
              </div>
              <div className="stats-section2">
                <h4>Appointment Statistics</h4>
                <p>
                  <strong>Total Appointments:</strong> {totalAppointments}
                </p>
                <p>
                  <strong>Accepted Appointments:</strong> {acceptedAppointments}
                </p>
                <p>
                  <strong>Pending Appointments:</strong> {pendingAppointments}
                </p>
              </div>
            </>
          )}
        </div>

        {activeTab === "appointments" && (
          <div className="rightmain">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="appointment-card"
                >
                  <p>
                    <strong>Patient Name:</strong> {appointment.patientName}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {appointment.details}
                  </p>
                  <p>
                    <strong>Appointment Date:</strong>{" "}
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {appointment.status}
                  </p>
                  <p>
                    <strong>Prescription:</strong>{" "}
                    {appointment.prescriptionText ||
                      "No prescription added yet."}
                  </p>
                  <button
                    onClick={() =>
                      handleUpdateStatus(appointment.appointmentId, "Accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(appointment.appointmentId, "Rejected")
                    }
                  >
                    Reject
                  </button>
                  {appointment.status === "Accepted" && (
                    <div className="prescription-section">
                      <h4>Add Prescription</h4>
                      <input
                        type="text"
                        placeholder="Enter prescription"
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                      />
                      <button
                        onClick={() =>
                          handleAddPrescription(appointment.appointmentId)
                        }
                      >
                        Submit Prescription
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No appointments available.</p>
            )}
          </div>
        )}

        {activeTab === "edit-profile" && (
          <div className="edit-profile-section">
            <h4>Edit Profile</h4>
            <label>Specialization:</label>
            <input
              type="text"
              value={doctor?.specialization || ""}
              onChange={(e) =>
                setDoctor({ ...doctor, specialization: e.target.value })
              }
            />
            <label>Experience (in years):</label>
            <input
              type="number"
              value={doctor?.experience || ""}
              onChange={(e) =>
                setDoctor({ ...doctor, experience: e.target.value })
              }
            />
            <button onClick={handleProfileUpdate}>Save Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;

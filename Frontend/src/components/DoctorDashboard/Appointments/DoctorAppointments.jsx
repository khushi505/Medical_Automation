import React, { useState } from "react";
import "./DoctorAppointments.css";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Alice Smith",
      symptoms: "Fever, cough",
      slotTime: "10:00 AM - 10:30 AM",
      status: "Pending",
      prescription: "",
    },
    {
      id: 2,
      patientName: "Bob Johnson",
      symptoms: "Headache, sore throat",
      slotTime: "11:00 AM - 11:30 AM",
      status: "Pending",
      prescription: "",
    },
  ]);

  const [prescriptions, setPrescriptions] = useState({});

  const handleAccept = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "Accepted" } : apt))
    );
  };

  const handleReject = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "Rejected" } : apt))
    );
  };

  const handlePrescriptionChange = (id, value) => {
    setPrescriptions((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddPrescription = (id) => {
    const presc = prescriptions[id] || "";
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, prescription: presc } : apt))
    );
    alert("Prescription added");
  };

  return (
    <div className="appointments-section-doctor">
      <h2>Patient Appointments</h2>
      {appointments.length > 0 ? (
        <div className="appointments-list-doctor">
          {appointments.map((apt) => (
            <div key={apt.id} className="appointment-card-doctor">
              <p>
                <strong>Patient Name:</strong> {apt.patientName}
              </p>
              <p>
                <strong>Symptoms:</strong> {apt.symptoms}
              </p>
              <p>
                <strong>Slot Time:</strong> {apt.slotTime}
              </p>
              <p>
                <strong>Status:</strong> {apt.status}
              </p>

              {apt.status === "Pending" && (
                <div className="action-buttons-doctor">
                  <button
                    className="accept-btn-doctor"
                    onClick={() => handleAccept(apt.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn-doctor"
                    onClick={() => handleReject(apt.id)}
                  >
                    Reject
                  </button>
                </div>
              )}

              {apt.status === "Accepted" && (
                <div className="prescription-section-doctor">
                  {apt.prescription ? (
                    <p>
                      <strong>Prescription:</strong> {apt.prescription}
                    </p>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Enter prescription"
                        value={prescriptions[apt.id] || ""}
                        onChange={(e) =>
                          handlePrescriptionChange(apt.id, e.target.value)
                        }
                      />
                      <button
                        className="add-prescription-btn-doctor"
                        onClick={() => handleAddPrescription(apt.id)}
                      >
                        Add Prescription
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No appointments available.</p>
      )}
    </div>
  );
}

export default DoctorAppointments;

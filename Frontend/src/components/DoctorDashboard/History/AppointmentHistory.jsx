import React, { useState, useEffect } from "react";
import "./AppointmentHistory.css";

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Alice Smith",
      date: "2025-03-12",
      time: "10:00 AM",
      symptoms: "Fever, cough",
      prescription: "Paracetamol 500mg",
    },
    {
      id: 2,
      patientName: "Bob Johnson",
      date: "2025-03-12",
      time: "11:30 AM",
      symptoms: "Headache, sore throat",
      prescription: "",
    },
    {
      id: 3,
      patientName: "Charlie Brown",
      date: "2025-03-11",
      time: "09:45 AM",
      symptoms: "Stomach ache",
      prescription: "Antacid, IV fluids",
    },
  ]);

  useEffect(() => {
    // TODO: Replace with real fetch from backend
  }, []);

  // Helper to format from YYYY-MM-DD => dd-mm-yyyy
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    const yyyy = d.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return `${dd}-${mm}-${yyyy}`;
  };

  // Group by date
  const grouped = appointments.reduce((acc, apt) => {
    const dateKey = formatDate(apt.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(apt);
    return acc;
  }, {});

  // Sort the dates descending
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const [da, ma, ya] = a.split("-");
    const [db, mb, yb] = b.split("-");
    const dateA = new Date(`${ya}-${ma}-${da}`);
    const dateB = new Date(`${yb}-${mb}-${db}`);
    return dateB - dateA;
  });

  return (
    <div className="appointment-history-section">
      <h2>Appointment History</h2>
      {sortedDates.length > 0 ? (
        sortedDates.map((dateKey) => (
          <div key={dateKey} className="appointment-date-group">
            <h3 className="date-heading">{dateKey}</h3>
            <div className="appointment-cards-group">
              {grouped[dateKey].map((apt) => (
                <div key={apt.id} className="appointment-history-card">
                  <p>
                    <strong>Patient Name:</strong> {apt.patientName}
                  </p>
                  <p>
                    <strong>Time:</strong> {apt.time}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {apt.symptoms}
                  </p>
                  <p>
                    <strong>Prescription:</strong>{" "}
                    {apt.prescription || "Not Provided"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No appointment history available.</p>
      )}
    </div>
  );
}

export default AppointmentHistory;

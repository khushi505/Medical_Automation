import React, { useRef } from "react";
import "./BookSlot.css";

function BookSlot({
  newAppointment,
  setNewAppointment,
  onBook,
  appointments,
  onSimulate,
}) {
  // Refs for date input if needed
  const dateInputRef = useRef(null);

  // List of doctors for selection
  const doctors = [
    "Dr Venkata Abhinay Talasila",
    "Dr Sabeeha Farheen Sirvella",
    "Dr Raju Dudam",
  ];

  return (
    <div className="book-slot-card">
      <h2>Book an Appointment</h2>
      <form onSubmit={onBook} className="book-slot-form">
        {/* Doctor Selection */}
        <div className="form-group">
          <label>Doctor</label>
          <select
            value={newAppointment.doctor || ""}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                doctor: e.target.value,
              })
            }
            required
          >
            <option value="" disabled>
              Select a Doctor
            </option>
            {doctors.map((doc, index) => (
              <option key={index} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="form-group">
          <label>Date</label>
          <label className="date-label">
            <input
              type="date"
              ref={dateInputRef}
              value={newAppointment.date}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, date: e.target.value })
              }
              required
            />
            <span className="date-icon">📅</span>
          </label>
        </div>

        {/* Time Selection */}
        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            value={newAppointment.time || ""}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, time: e.target.value })
            }
            required
          />
        </div>

        {/* Details / Symptoms */}
        <div className="form-group">
          <label>Details / Symptoms</label>
          <textarea
            rows="3"
            value={newAppointment.details || ""}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, details: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Book
        </button>
      </form>
      <p className="info-text">
        Your appointment request is submitted. Please check the Medical History
        section for updates.
      </p>
    </div>
  );
}

export default BookSlot;

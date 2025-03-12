import React, { useState, useEffect } from "react";
import "./DoctorLeaveApproval.css";

function DoctorLeaveApproval() {
  // Dummy data simulating leave requests
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      patientName: "Alice Smith",
      reason: "Fever, Headache",
      symptoms: "Fever, chills, mild cough",
      startDate: "2025-03-15",
      endDate: "2025-03-18",
      severity: "Moderate",
      doctorConsulted: true,
      reportFile: "report-123.pdf", // The uploaded file name
      status: "Pending",
    },
    {
      id: 2,
      patientName: "Bob Johnson",
      reason: "Severe migraine",
      symptoms: "Intense headache, nausea",
      startDate: "2025-03-20",
      endDate: "2025-03-22",
      severity: "Severe",
      doctorConsulted: false,
      reportFile: "",
      status: "Pending",
    },
  ]);

  useEffect(() => {
    // TODO: Fetch real data from your backend, e.g.:
    // fetch("/api/doctor/leave-requests")
    //   .then(res => res.json())
    //   .then(data => setLeaveRequests(data))
    //   .catch(err => console.error(err));
  }, []);

  const handleApprove = (id) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
    );
  };

  const handleReject = (id) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    );
  };

  // This function forms the full URL to the file on your server
  // Adjust it based on your actual backend file serving location
  const getReportFileURL = (fileName) => {
    // Example: If your backend serves files at /uploads/<filename>
    return fileName ? `https://example.com/uploads/${fileName}` : null;
  };

  const handleViewReport = (fileName) => {
    const fileURL = getReportFileURL(fileName);
    if (fileURL) {
      window.open(fileURL, "_blank");
    } else {
      alert("No report file found.");
    }
  };

  return (
    <div className="doctor-leave-approval-section">
      <h2>Leave Approval</h2>
      {leaveRequests.length > 0 ? (
        <div className="leave-requests-grid">
          {leaveRequests.map((req) => (
            <div key={req.id} className="leave-request-card">
              <p>
                <strong>Patient Name:</strong> {req.patientName}
              </p>
              <p>
                <strong>Reason:</strong> {req.reason}
              </p>
              <p>
                <strong>Symptoms:</strong> {req.symptoms}
              </p>
              <p>
                <strong>Illness Start Date:</strong> {req.startDate}
              </p>
              <p>
                <strong>Illness End Date:</strong> {req.endDate}
              </p>
              <p>
                <strong>Severity:</strong> {req.severity}
              </p>
              <p>
                <strong>Consulted Doctor:</strong>{" "}
                {req.doctorConsulted ? "Yes" : "No"}
              </p>
              <p>
                <strong>Report File:</strong>{" "}
                {req.reportFile ? (
                  <button
                    className="view-report-btn"
                    onClick={() => handleViewReport(req.reportFile)}
                  >
                    View
                  </button>
                ) : (
                  "None"
                )}
              </p>
              <p>
                <strong>Status:</strong> {req.status}
              </p>

              {req.status === "Pending" && (
                <div className="leave-action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(req.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(req.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No leave requests available.</p>
      )}
    </div>
  );
}

export default DoctorLeaveApproval;

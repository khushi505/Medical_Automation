import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DoctorLeaveApproval.css";

function DoctorLeaveApproval() {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/doctor/leave-forms",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaveRequests(response.data.leaveForms || []);
    } catch (error) {
      console.error("Error fetching doctor leave forms:", error);
    }
  };

  const handleUpdateStatus = async (leaveId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/doctor/leave-forms/update",
        { leaveFormId: leaveId, status: newStatus }, // Use 'leaveFormId'
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the local state to reflect the new status
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req._id === leaveId ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  };

  return (
    <div className="doctor-leave-approval-section">
      <h2>Leave Approval</h2>
      {leaveRequests.length > 0 ? (
        <div className="leave-requests-grid">
          {leaveRequests.map((req) => (
            <div key={req._id} className="leave-request-card">
              <p>
                <strong>Patient Name:</strong> {req.patient?.name || "N/A"}
              </p>
              <p>
                <strong>Reason:</strong> {req.reason}
              </p>
              <p>
                <strong>Symptoms:</strong> {req.symptoms}
              </p>
              <p>
                <strong>Illness Start Date:</strong>{" "}
                {req.illnessStartDate || "N/A"}
              </p>
              <p>
                <strong>Illness End Date:</strong> {req.illnessEndDate || "N/A"}
              </p>
              <p>
                <strong>Severity:</strong> {req.severity}
              </p>
              <p>
                <strong>Consulted Doctor:</strong>{" "}
                {req.consultedDoctor ? "Yes" : "No"}
              </p>
              <p>
                <strong>Report File:</strong>{" "}
                {req.reportFile ? "Uploaded" : "None"}
              </p>
              <p>
                <strong>Status:</strong> {req.status}
              </p>
              {req.status === "Pending" && (
                <div className="leave-action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => handleUpdateStatus(req._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleUpdateStatus(req._id, "Rejected")}
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

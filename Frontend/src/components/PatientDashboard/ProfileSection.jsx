import React from "react";
import "./ProfileSection.css";

function ProfileSection({ user, hoursInfo }) {
  return (
    <div className="profile-section-new">
      <h2 className="profile-title">Profile Details</h2>
      <div className="profile-cards-wrapper">
        {/* Left card: Background image with user details */}
        <div className="profile-card-left">
          <div className="profile-info-overlay">
            <h3 className="profile-name">{user.name}</h3>
            <div className="details-grid">
              {/* Left column */}
              <div className="col-left">
                <p>
                  <strong>Branch:</strong> {user.branch}
                </p>
                <p>
                  <strong>Hostel Name:</strong> {user.hostelName}
                </p>
                <p>
                  <strong>Room No:</strong> {user.roomNo}
                </p>
                <p>
                  <strong>Section:</strong> {user.section}
                </p>
                <p>
                  <strong>Weight:</strong>{" "}
                  {user.weight ? user.weight + " kg" : "N/A"}
                </p>
              </div>
              {/* Right column */}
              <div className="col-right">
                <p>
                  <strong>Height:</strong>{" "}
                  {user.height ? user.height + " cm" : "N/A"}
                </p>
                <p>
                  <strong>Disease:</strong> {user.disease || "None"}
                </p>
                <p>
                  <strong>Contact:</strong> {user.contact}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right card: Hours & Contact */}
        <div className="profile-card-right">
          <h3>Hours & Contact</h3>
          <p>
            <strong>OPD Service:</strong> {hoursInfo.opd}
          </p>
          <p>
            <strong>Emergency Service:</strong> {hoursInfo.emergency}
          </p>
          <p>
            <strong>Ambulance Service:</strong> {hoursInfo.ambulance}
          </p>
          <p>
            <strong>Pharmacy Service:</strong> {hoursInfo.pharmacy}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;

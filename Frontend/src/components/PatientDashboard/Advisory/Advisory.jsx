import React, { useState } from "react";
import "./Advisory.css";

function Advisory({ advisories }) {
  // Default dummy data in case no advisory data is provided
  const defaultAdvisories = [
    {
      id: 1,
      title: "Seasonal Flu Outbreak",
      date: "2023-11-01",
      description:
        "A seasonal flu outbreak has been observed in the region. Symptoms typically include fever, chills, muscle aches, cough, congestion, runny nose, headaches, and fatigue. Please consider getting vaccinated if you haven't yet, and be sure to wash your hands regularly to reduce the spread.",
      precautions:
        "Get vaccinated; wash your hands regularly; avoid crowded places.",
      announcementBy: "Dr. Sharma",
      severity: "High", // or "Medium" or "Low"
      imageUrl: "/assets/flu.png", // optional image
    },
    {
      id: 2,
      title: "Dengue Alert",
      date: "2023-10-20",
      description:
        "Dengue cases are on the rise in certain areas. Watch out for fever, headache, muscle and joint pains, and a characteristic skin rash that is similar to measles.",
      precautions:
        "Use mosquito repellent; eliminate stagnant water; wear protective clothing.",
      announcementBy: "Dr. Reddy",
      severity: "Medium",
      imageUrl: "/assets/dengue.png",
      // no imageUrl, so no image displayed for this card
    },
    {
      id: 3,
      title: "Waterborne Diseases",
      date: "2023-10-05",
      description:
        "Contaminated water sources have been reported in some neighborhoods. Common waterborne illnesses include cholera, typhoid, and dysentery. Ensure proper filtration or boiling of water before use.",
      precautions: "Boil water before use; avoid consuming unfiltered water.",
      announcementBy: "Dr. Verma",
      severity: "Low",
      imageUrl: "/assets/water.png",
    },
  ];

  // Merge default data if no advisories provided
  const advisoryData =
    advisories && advisories.length > 0 ? advisories : defaultAdvisories;

  return (
    <div className="advisory-section">
      <h2>Health Advisories & Announcements</h2>
      <div className="advisory-grid">
        {advisoryData.map((advisory) => (
          <AdvisoryCard key={advisory.id} advisory={advisory} />
        ))}
      </div>
    </div>
  );
}

// A sub-component to handle the read-more toggle, severity badge, etc.
function AdvisoryCard({ advisory }) {
  const [expanded, setExpanded] = useState(false);

  // Decide how many characters to show if not expanded
  const MAX_CHARS = 120;
  const isLong = advisory.description.length > MAX_CHARS;
  const shortDesc = advisory.description.slice(0, MAX_CHARS) + "...";

  const severityColor = getSeverityColor(advisory.severity);

  return (
    <div className="advisory-card">
      {/* Optional image */}
      {advisory.imageUrl && (
        <img
          src={advisory.imageUrl}
          alt="advisory"
          className="advisory-image"
        />
      )}

      {/* Title + Severity Badge */}
      <div className="advisory-header">
        <h3 className="advisory-title">{advisory.title}</h3>
        {advisory.severity && (
          <span
            className="advisory-severity"
            style={{ backgroundColor: severityColor }}
          >
            {advisory.severity}
          </span>
        )}
      </div>

      <p className="advisory-date">{advisory.date}</p>

      {/* Description with Read More toggle */}
      <p className="advisory-description">
        {isLong && !expanded ? shortDesc : advisory.description}
      </p>
      {isLong && (
        <button
          className="read-more-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}

      <p className="advisory-precautions">
        <strong>Precautions:</strong> {advisory.precautions}
      </p>
      <p className="advisory-announcement">
        <em>Announcement by: {advisory.announcementBy}</em>
      </p>
    </div>
  );
}

// Helper function to map severity to color
function getSeverityColor(severity) {
  switch (severity?.toLowerCase()) {
    case "high":
      return "#d9534f"; // red
    case "medium":
      return "#f0ad4e"; // orange
    case "low":
      return "#5cb85c"; // green
    default:
      return "#777"; // grey if severity not provided
  }
}

export default Advisory;

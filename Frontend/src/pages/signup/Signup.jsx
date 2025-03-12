import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [hostelName, setHostelName] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add sign-up logic (API call, validations, etc.)
    console.log({
      name,
      email,
      password,
      role,
      hostelName,
      roomNo,
      branch,
      section,
      gender,
      contact,
    });
  };

  // Handles Google sign-up
  const handleGoogleSignUp = () => {
    // TODO: Implement Google sign-up logic
    console.log("Sign up with Google clicked");
  };

  return (
    <div className="signup-container-distinct">
      {/* Left side: 3/4 background image */}
      <div className="left-section-signup">
        {/* Optional SRM logo overlay */}
        <img
          src="/assets/llogo.png"
          alt="SRM Logo"
          className="srm-logo-signup"
        />
      </div>

      {/* Right side: 1/4 sign-up card */}
      <div className="right-section-signup">
        <div className="signup-card-distinct">
          <h2 className="title-signup">Create Account</h2>

          <form onSubmit={handleSubmit} className="signup-form-distinct">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="yourname@srmap.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="doctor">Doctor</option>
              {/* Add more roles if needed */}
            </select>

            <label htmlFor="hostelName">Hostel Name</label>
            <input
              id="hostelName"
              type="text"
              placeholder="e.g. DH-2"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
            />

            <label htmlFor="roomNo">Room No</label>
            <input
              id="roomNo"
              type="text"
              placeholder="301"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
            />

            <label htmlFor="branch">Branch</label>
            <input
              id="branch"
              type="text"
              placeholder="e.g. CSE"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />

            <label htmlFor="section">Section</label>
            <input
              id="section"
              type="text"
              placeholder="e.g. A"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />

            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label htmlFor="contact">Contact</label>
            <input
              id="contact"
              type="text"
              placeholder="Enter your phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <button type="submit" className="signup-btn-distinct">
              Submit
            </button>
          </form>

          <div className="divider-signup">OR</div>

          <button
            className="google-signup-btn-distinct"
            onClick={handleGoogleSignUp}
          >
            <img
              src="/assets/google.png"
              alt="Google icon"
              className="google-icon-signup"
            />
            <span>Sign up with Google</span>
          </button>

          {/* Already have an account? Link to login */}
          <p className="login-text-distinct">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

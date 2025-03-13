import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // **API Endpoint** for login
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      console.log("Login successful:", response.data);
      // Save token (e.g., localStorage.setItem("token", response.data.token)) and navigate to protected route
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Add your Google login logic here
    console.log("Sign in with Google clicked");
  };

  return (
    <div className="login-container">
      {/* Left side: 3/4 with background image */}
      <div className="left-section"></div>

      {/* Right side: 1/4 background + card container */}
      <div className="right-section">
        <div className="login-card">
          <p className="title">Please Use Your University ID only</p>

          <form onSubmit={handleSubmit} className="login-form">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="divider">OR</div>

          {/* Sign in with Google button */}
          <button className="google-login-btn" onClick={handleGoogleLogin}>
            {/* Replace the src below with your actual Google icon path */}
            <img
              src="/assets/google.png"
              alt="Google icon"
              className="google-icon"
            />
            <span>Login with Google</span>
          </button>

          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

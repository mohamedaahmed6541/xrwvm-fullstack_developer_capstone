import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userName || !firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await fetch("/djangoapp/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.status === "Authenticated") {
        sessionStorage.setItem("username", data.userName);
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else if (data.error === "Already Registered") {
        setError("This username is already registered. Please choose another.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join Best Cars Dealership today</p>

        {error && <div className="register-alert error">{error}</div>}
        {success && <div className="register-alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="johndoe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
            <small className="form-hint">At least 6 characters</small>
          </div>

          <button type="submit" className="register-btn" disabled={success}>
            {success ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <a href="/login" className="register-link">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
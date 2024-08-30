import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState(""); // Change username to name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name: name, // Use name instead of username
        email: email,
        password: password,
      });

      console.log("Registration successful:", response.data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Registration failed:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="name">Name:</label>{" "}
          {/* Change label from username to name */}
          <input
            type="text"
            id="name" // Change id from username to name
            value={name} // Use name state
            onChange={(e) => setName(e.target.value)} // Update state for name
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={buttonContainerStyle}>
          <button type="submit" style={buttonStyle}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

const formContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "50px",
  justifyContent: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  width: "300px",
};

const inputGroupStyle = {
  marginBottom: "15px",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  width: "100%",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#333",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  width: "100%",
};

export default Register;
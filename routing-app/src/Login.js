import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn, setUserName }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: email,
        password: password,
      });

      console.log(response.data); // Log the full response data to inspect the structure

      // Save the token and user name in localStorage
      localStorage.setItem("authToken", response.data.token);

      // Check if the response contains the user's name
      if (response.data.user && response.data.user.name) {
        localStorage.setItem("userName", response.data.user.name); // Save the user's name
        localStorage.setItem("userId", response.data.user.id); // Save the user's ID
        setUserName(response.data.user.name); // Set the user's name in state
      } else {
        console.warn("User name not found in the response.");
      }

      // Update state to indicate the user is logged in
      setIsLoggedIn(true);

      // Show success message
      alert("Login successful!");

      // Redirect to the map page
      navigate("/map");
    } catch (error) {
      if (error.response) {
        console.error("Login failed:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
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
            Login
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

export default Login;

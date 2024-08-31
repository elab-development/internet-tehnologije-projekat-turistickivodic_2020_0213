import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import MapComponent from "./MapComponent";
import Login from "./Login";
import Register from "./Register";

const App = () => {
  const [userName, setUserName] = useState(""); // State to hold the user's name
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Effect to check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName"); // Retrieve username from local storage
    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name); // Set the username
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName(""); // Clear the username
    localStorage.removeItem("authToken"); // Remove token
    localStorage.removeItem("userName"); // Remove username
    alert("You have been logged out.");
  };

  const navItemStyle = {
    margin: "0 10px",
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
  };

  return (
    <Router>
      <div>
        <nav style={navStyle}>
          <ul style={navListStyle}>
            <li style={navItemStyle}>
              <Link to="/" style={linkStyle}>
                Home
              </Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/map" style={linkStyle}>
                Map
              </Link>
            </li>
            {isLoggedIn && <span style={userNameStyle}>{userName}</span>}{" "}
            {/* Display username */}
            <li style={navItemStyle}>
              {isLoggedIn ? (
                <Link to="/" onClick={handleLogout} style={linkStyle}>
                  Logout
                </Link>
              ) : (
                <Link to="/login" style={linkStyle}>
                  Login
                </Link>
              )}
            </li>
            <li style={navItemStyle}>
              <Link to="/register" style={linkStyle}>
                Register
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapComponent />} />
          <Route
            path="/login"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />
            }
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

const navStyle = {
  background: "#333",
  padding: "10px",
};

const navListStyle = {
  listStyle: "none",
  display: "flex",
  justifyContent: "space-around",
};

const userNameStyle = {
  color: "#fff",
  marginRight: "20px",
  alignSelf: "center",
};

export default App;

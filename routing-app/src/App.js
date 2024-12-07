import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import MapComponent from "./MapComponent";
import Login from "./Login";
import Register from "./Register";
import MyRoutes from "./MyRoutes";

const App = () => {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Effect to check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");
    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
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
        {}
        {isLoggedIn && (
          <div style={userNameDisplayStyle}>Welcome, {userName}!</div>
        )}
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
            <li style={navItemStyle}>
              <Link to="/routes" style={linkStyle}>
                My Routes
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
          <Route
            path="/routes"
            element={<MyRoutes isLoggedIn={isLoggedIn} />}
          />
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

const userNameDisplayStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "2px",
  textAlign: "center",
};

export default App;

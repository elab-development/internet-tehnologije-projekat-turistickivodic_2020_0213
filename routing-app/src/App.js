import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import MapComponent from "./MapComponent";
import About from "./About";
import Register from "./Register";

const App = () => {
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
            <li style={navItemStyle}>
              <Link to="/about" style={linkStyle}>
                About
              </Link>
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
          <Route path="/about" element={<About />} />
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

export default App;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyRoutes.css"; // Import the CSS file

const MyRoutes = ({ isLoggedIn, onRouteSelect }) => {
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name"); // New state for filter type
  const routesPerPage = 3;
  const navigate = useNavigate();
  const alertShownRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) {
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        alert("You must be logged in to view your routes.");
        navigate("/login");
      }
      return;
    }

    const fetchRoutes = async () => {
      try {
        const userRole = localStorage.getItem("userRole"); // Get user role from local storage
        let response;

        if (userRole === "admin") {
          response = await axios.get(`http://127.0.0.1:8000/api/routes`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          setRoutes(response.data || []);
        } else {
          const userId = localStorage.getItem("userId");
          response = await axios.get(
            `http://127.0.0.1:8000/api/approved/${userId}`,
            {
              role: userRole,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          setRoutes(response.data);
        }
        console.log("API Response:", response.data); // Log the response data
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, [isLoggedIn, navigate]);

  const handleDeleteRoute = async (routeId) => {
    try {
      const routeResponse = await axios.get(
        `http://127.0.0.1:8000/api/routes/${routeId}`
      );
      const locations = routeResponse.data.locations;
      console.log("Locations to delete:", locations);

      const deleteLocationPromises = locations.map((location) =>
        axios.delete(`http://127.0.0.1:8000/api/locations/${location.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
      );

      await Promise.all(deleteLocationPromises);

      await axios.delete(`http://127.0.0.1:8000/api/routes/${routeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.id !== routeId)
      );
      alert("Route and its locations deleted successfully.");
    } catch (error) {
      console.error("Error deleting route and locations:", error);
      alert("Failed to delete the route and its locations.");
    }
  };

  const handleApproveRoute = async (routeId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/routes/${routeId}/approve`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Route approved successfully");

      // Update the state to reflect the route approval
      setRoutes((prevRoutes) =>
        prevRoutes.map((route) =>
          route.id === routeId ? { ...route, approved: true } : route
        )
      );
    } catch (error) {
      console.error("Error approving route:", error);
    }
  };

  // Filtering logic based on selected filter criteria
  const filteredRoutes = routes.filter((route) => {
    switch (filterBy) {
      case "name":
        return route.name.toLowerCase().includes(filter.toLowerCase());
      case "location":
        return route.locations.some((location) =>
          location.name.toLowerCase().includes(filter.toLowerCase())
        );
      case "duration":
        // Convert 'route.total_duration' to total minutes (assuming it is in the format "X hours Y minutes")
        const durationString = route.total_duration;
        const hoursMatch = durationString.match(/(\d+)\shours/);
        const minutesMatch = durationString.match(/(\d+)\sminutes/);

        const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

        // Convert total duration to minutes
        const totalMinutes = hours * 60 + minutes;

        // Compare against the filter (which is expected to be a number of minutes)
        return totalMinutes < parseInt(filter) || filter === "";
      default:
        return true;
    }
  });

  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = filteredRoutes.slice(
    indexOfFirstRoute,
    indexOfLastRoute
  );

  const totalPages = Math.ceil(filteredRoutes.length / routesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return isLoggedIn ? (
    <div className="my-routes-container">
      <h1>My Routes</h1>

      {/* Filter Combo Box */}
      <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="location">Location</option>
        <option value="duration">Duration</option>
      </select>

      {/* Filter Input */}
      <input
        type="text"
        placeholder={`Filter routes by ${filterBy}...`}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {currentRoutes.length === 0 ? (
        <p>No routes found.</p>
      ) : (
        currentRoutes.map((route) => (
          <div key={route.id}>
            <h2>{route.name}</h2>
            <p>{route.description}</p>
            <p>Total length: {route.total_duration}</p>

            <p style={{ color: route.approved ? "green" : "red" }}>
              {route.approved ? "Approved" : "Not Approved"}
            </p>

            <ul>
              {route.locations.map((location) => (
                <li key={location.id}>
                  {location.order}: {location.name} (Lat: {location.latitude},
                  Lng: {location.longitude})
                </li>
              ))}
            </ul>

            <button onClick={() => handleDeleteRoute(route.id)}>
              Delete Route
            </button>

            {/* Show Approve button for admin users if route is not approved */}
            {localStorage.getItem("userRole") === "admin" &&
              !route.approved && (
                <button onClick={() => handleApproveRoute(route.id)}>
                  Approve Route
                </button>
              )}
          </div>
        ))
      )}

      {/* Pagination Controls */}
      {filteredRoutes.length > routesPerPage && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
    </div>
  ) : null;
};

export default MyRoutes;

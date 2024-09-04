import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyRoutes = ({ isLoggedIn, onRouteSelect }) => {
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(""); // Filter state
  const routesPerPage = 3; // Number of routes to display per page
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
            `http://127.0.0.1:8000/api/user/${userId}/routes`,
            { role: userRole }
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
        axios.delete(`http://127.0.0.1:8000/api/locations/${location.id}`)
      );

      await Promise.all(deleteLocationPromises);

      await axios.delete(`http://127.0.0.1:8000/api/routes/${routeId}`);

      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.id !== routeId)
      );
      alert("Route and its locations deleted successfully.");
    } catch (error) {
      console.error("Error deleting route and locations:", error);
      alert("Failed to delete the route and its locations.");
    }
  };

  // Filter the routes based on the filter input
  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination logic
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
    <div>
      <h1>My Routes</h1>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter routes by name..."
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
          </div>
        ))
      )}

      {/* Pagination Controls */}
      {filteredRoutes.length > routesPerPage && (
        <div>
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

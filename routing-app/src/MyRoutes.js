import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyRoutes = ({ isLoggedIn, onRouteSelect }) => {
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
        const userId = localStorage.getItem("userId"); // Get user ID from local storage
        const response = await axios.get(
          `http://127.0.0.1:8000/api/user/${userId}/routes`
        );
        setRoutes(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, [isLoggedIn, navigate]);

  const handleShowOnMap = (route) => {
    console.log("Selected route:", route);
    navigate("/map", { state: { route } }); // Navigate to MapComponent with the selected route as state
  };

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

  // Pagination logic
  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = routes.slice(indexOfFirstRoute, indexOfLastRoute);

  const totalPages = Math.ceil(routes.length / routesPerPage);

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
            <button onClick={() => handleShowOnMap(route)}>Show on Map</button>
            <button onClick={() => handleDeleteRoute(route.id)}>
              Delete Route
            </button>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      {routes.length > routesPerPage && (
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

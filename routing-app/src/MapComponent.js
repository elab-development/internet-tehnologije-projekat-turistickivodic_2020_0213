import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [center, setCenter] = useState({ lat: 44.8125449, lng: 20.46123 });
  const mapRef = useRef(null);

  const mapContainerStyle = {
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: "88vh",
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC6MUmcb35NXsOgxJl5hWdM9Bnp5jDOsgw",
  });

  const directionsCallback = useCallback((response) => {
    if (response !== null && response.status === "OK") {
      setDirections(response);
      setShowDirections(false);
    } else {
      console.log("Directions request failed");
    }
  }, []);

  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleOriginChange = (e) => setOrigin(e.target.value);
  const handleDestinationChange = (e) => setDestination(e.target.value);

  const handleWaypointChange = (index, value) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = value;
    setWaypoints(newWaypoints);
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""]);
  };

  const removeWaypoint = (index) => {
    const newWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(newWaypoints);
    setShowDirections(false); // Trigger re-render without the removed waypoint
  };

  const geocodeAddress = (address, callback) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        callback(location.lat(), location.lng());
      } else {
        console.log(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  };

  const logLatLng = () => {
    geocodeAddress(origin, (lat, lng) => {
      console.log("Origin:", { lat, lng });
    });
    geocodeAddress(destination, (lat, lng) => {
      console.log("Destination:", { lat, lng });
    });
    waypoints.forEach((waypoint, index) => {
      geocodeAddress(waypoint, (lat, lng) => {
        console.log(`Waypoint ${index + 1}:`, { lat, lng });
      });
    });
  };

  const handleRouteClick = () => {
    if (origin !== "" && destination !== "") {
      console.log("Route Details:");
      console.log("Name:", name);
      console.log("Description:", description);
      console.log("Origin:", origin);

      waypoints.forEach((waypoint, index) => {
        console.log(`Waypoint ${index + 1}:`, waypoint);
      });

      console.log("Destination:", destination);

      logLatLng();
      setShowDirections(true);
    }
  };

  const handleSaveRoute = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Get the token from local storage
      const userId = localStorage.getItem("userId"); // Get the user ID from local storage

      // Save the route
      const routeResponse = await axios.post(
        "http://127.0.0.1:8000/api/routes",
        { name, description, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      const routeId = routeResponse.data.route.id;
      console.log("Route Response:", routeResponse);

      // Save each location
      const locations = [
        { name: "Origin", address: origin, order: 1 },
        ...waypoints.map((wp, index) => ({
          name: `Waypoint ${index + 1}`,
          address: wp,
          order: index + 2,
        })),
        {
          name: "Destination",
          address: destination,
          order: waypoints.length + 2,
        },
      ];

      console.log(locations);

      try {
        await Promise.all(
          locations.map((location) => {
            return new Promise((resolve) => {
              geocodeAddress(location.address, async (lat, lng) => {
                if (lat !== undefined && lng !== undefined) {
                  try {
                    console.log(lat, lng);

                    await axios.post(
                      "http://127.0.0.1:8000/api/locations",
                      {
                        name: location.name,
                        route_id: routeId,
                        latitude: lat,
                        longitude: lng,
                        order: location.order,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`, // Include the token in the headers
                        },
                      }
                    );
                  } catch (error) {
                    console.error(
                      "Error saving location:",
                      error.response.data
                    );
                  }
                } else {
                  console.error(
                    `Invalid coordinates for address: ${location.address}`
                  );
                }
                resolve();
              });
            });
          })
        );
      } catch (error) {
        console.error("Error in saving locations:", error);
      }

      alert("Route and locations saved successfully!");
    } catch (error) {
      console.error("Failed to save route:", error);
      alert("Failed to save route. Please try again.");
    }
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    if (map) {
      setCenter(map.getCenter().toJSON());
    }
  }, []);

  const controlsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "10px",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  };

  const inputStyle = {
    padding: "5px",
    fontSize: "14px",
    width: "100%",
    maxWidth: "300px",
  };

  const buttonStyle = {
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <div>
      <div style={controlsStyle}>
        {/* First row: Name and Description */}
        <div style={rowStyle}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            style={inputStyle}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
            style={{ ...inputStyle, height: "60px" }}
          />
        </div>

        {/* Second row: Origin, Add Waypoint, Destination, and Get Route */}
        <div style={rowStyle}>
          <input
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={handleOriginChange}
            style={inputStyle}
          />
          {waypoints.map((waypoint, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="text"
                placeholder={`Waypoint ${index + 1}`}
                value={waypoint}
                onChange={(e) => handleWaypointChange(index, e.target.value)}
                style={inputStyle}
              />
              <button onClick={() => removeWaypoint(index)} style={buttonStyle}>
                Remove
              </button>
            </div>
          ))}
          <button onClick={addWaypoint} style={buttonStyle}>
            Add Waypoint
          </button>
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={handleDestinationChange}
            style={inputStyle}
          />
          <button onClick={handleRouteClick} style={buttonStyle}>
            Get Route
          </button>
          <button onClick={handleSaveRoute} style={buttonStyle}>
            Save Route
          </button>
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onMapLoad}
      >
        {showDirections && (
          <DirectionsService
            options={{
              destination: destination,
              origin: origin,
              waypoints: waypoints.map((wp) => ({ location: wp })),
              travelMode: "DRIVING",
            }}
            callback={directionsCallback}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;

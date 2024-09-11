import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import "./MapComponent.css";

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [center, setCenter] = useState({ lat: 44.8125449, lng: 20.46123 });
  const [totalDuration, setTotalDuration] = useState(null); // State to hold total duration
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC6MUmcb35NXsOgxJl5hWdM9Bnp5jDOsgw",
  });

  const directionsCallback = useCallback((response) => {
    if (response !== null && response.status === "OK") {
      setDirections(response);
      setShowDirections(false);

      const legs = response.routes[0].legs;
      let totalDurationInSeconds = 0; // Variable to hold total duration

      // Log travel time between each leg and accumulate the total duration
      legs.forEach((leg, index) => {
        totalDurationInSeconds += leg.duration.value; // Sum up the duration
        console.log(
          `Travel time to location ${index + 1}: ${leg.duration.text}`
        );
      });

      // Convert total duration from seconds to a readable format
      const totalHours = Math.floor(totalDurationInSeconds / 3600);
      const totalMinutes = Math.floor((totalDurationInSeconds % 3600) / 60);
      const totalTimeText = `${totalHours} hours ${totalMinutes} minutes`;

      setTotalDuration(totalTimeText); // Update state with total duration
      console.log("Total travel time:", totalTimeText); // Log total travel time
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
    setShowDirections(false);
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
      setTotalDuration(null); // Reset total duration when getting a new route
    }
  };

  const handleSaveRoute = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      // Create the route with the total duration
      const routeResponse = await axios.post(
        "http://127.0.0.1:8000/api/routes",
        {
          name,
          description,
          user_id: userId,
          total_duration: totalDuration, // Include total duration here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const routeId = routeResponse.data.route.id;
      console.log("Route Response:", routeResponse);

      const locations = [
        { name: origin, address: origin, order: 1 },
        ...waypoints.map((wp, index) => ({
          name: wp,
          address: wp,
          order: index + 2,
        })),
        {
          name: destination,
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
                          Authorization: `Bearer ${token}`,
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

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <div className="flex-container">
      <div className="controls-container">
        <div className="row-container">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
            className="textarea-field"
          />
        </div>

        <div className="row-container">
          <input
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={handleOriginChange}
            className="input-field"
          />
          <input type="datetime-local" id="start-time" />
          {waypoints.map((waypoint, index) => (
            <div key={index} className="waypoint-container">
              <input
                type="text"
                placeholder={`Waypoint ${index + 1}`}
                value={waypoint}
                onChange={(e) => handleWaypointChange(index, e.target.value)}
                className="input-field"
              />
              <button onClick={() => removeWaypoint(index)} className="button">
                Remove
              </button>
            </div>
          ))}
          <button onClick={addWaypoint} className="button">
            Add Waypoint
          </button>
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={handleDestinationChange}
            className="input-field"
          />
          <button onClick={handleRouteClick} className="button">
            Get Route
          </button>
          <button onClick={handleSaveRoute} className="button">
            Save Route
          </button>
        </div>
        {totalDuration && (
          <div className="total-duration">
            Total Travel Time: {totalDuration}
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerClassName="map-container"
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

import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
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
  };

  const handleRouteClick = () => {
    if (origin !== "" && destination !== "") {
      setShowDirections(true);
    }
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    // Only set center when the map loads for the first time
    if (map) {
      setCenter(map.getCenter().toJSON());
    }
  }, []);

  const controlsStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  };

  const inputStyle = {
    padding: "5px",
    fontSize: "14px",
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
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={3}
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

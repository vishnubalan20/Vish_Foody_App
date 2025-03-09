import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const TrackOrderMap = ({ orderId }) => {
  const [location, setLocation] = useState(null);
  const googleMapsApiKey = 'AIzaSyAVXLLfagT7KcZgG4kG4kApvl3FtJWocVg'; // Replace with your actual API Key

  // Set initial map container style
  const mapContainerStyle = {
    width: '100%',
    height: '500px',
  };

  // Set initial center of the map (Erode)
  const center = {
    lat: 11.3412,
    lng: 77.7170,
  };

  const restLoc = {
    lat: 11.3425,
    lng: 77.7231,
  };

  // Function to fetch the current location of the order
  const fetchLocation = async () => {
    // try {
    //   // Make an API call to get the order's location (replace this with your actual API)
    //   const response = await fetch(`/api/order/get-location/${orderId}`);
    //   const data = await response.json();
    //   setLocation(center); // Assuming the response contains { lat: ..., lng: ... }
    // } catch (error) {
    //   console.error("Error fetching order location:", error);
    // }
    setLocation(restLoc); 
  };

  // Fetch the order location when the component mounts
  useEffect(() => {
    fetchLocation();
    const id = setInterval(() => {
      fetchLocation(); // Re-fetch every 5 seconds
    }, 5000);

    return () => clearInterval(id); // Clean up the interval on component unmount
  }, [orderId]);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={location || center} // Use the fetched location if available, else fallback to the default
        zoom={15}
      >
        {/* Show a marker at the current order location */}
        {location && <Marker position={location} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default TrackOrderMap;

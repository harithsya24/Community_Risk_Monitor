import { useState, useEffect } from "react";
import { Coordinates } from "@shared/types";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        error: "Geolocation is not supported by your browser",
        loading: false,
      });
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 1800000,       
      maximumAge: 0          
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got device location:", position.coords.latitude, position.coords.longitude);
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        console.error("Geolocation error:", error.message, error.code);
        
        let errorMessage = "Unable to retrieve your location";
        
        if (error.code === 1) {
          errorMessage = "Location access was denied. Please enable location permissions for this site.";
        } else if (error.code === 2) {
          errorMessage = "Location information is unavailable. Please try again later.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Please check your connection and try again.";
        }
        
        setState({
          coordinates: null,
          error: errorMessage,
          loading: false,
        });
      },
      geoOptions
    );

    /*const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log("Got updated device location:", position.coords.latitude, position.coords.longitude);
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        console.error("Geolocation watch error:", error.message, error.code);
        
        let errorMessage = "Unable to track your location";
        
        if (error.code === 1) {
          errorMessage = "Location access was denied. Please enable location permissions for this site.";
        } else if (error.code === 2) {
          errorMessage = "Location information is unavailable. Please try again later.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Please check your connection and try again.";
        }
        
        setState({
          coordinates: null,
          error: errorMessage,
          loading: false,
        });
      },
      geoOptions
    );*/

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}

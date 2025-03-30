import { useState, useEffect } from "react";
import { useGeolocation } from "@/lib/useGeolocation";
import Header from "@/components/Header";
import FullScreenMap from "@/components/FullScreenMap";
import AIAssistant from "@/components/AIAssistant";
import ManualLocationEntry from "@/components/ManualLocationEntry";
import ManualLocationDialog from "@/components/ManualLocationDialog";
import { 
  WeatherCard, 
  EnvironmentCard, 
  SafetyCard, 
  FireCard, 
  NewsCard,
  TrafficCard
} from "@/components/RiskCards";
import { DisasterAlertCard } from "@/components/DisasterAlertCard";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchLocationInfo, 
  fetchWeatherData, 
  fetchEnvironmentData, 
  fetchSafetyData, 
  fetchFireData, 
  fetchNewsData,
  fetchTrafficData
} from "@/lib/api";
import { LocationInfo, Coordinates } from "@shared/types";

export default function Home() {
  const { coordinates: geoCoordinates, error: geoError, loading: geoLoading } = useGeolocation();
  const [manualCoordinates, setManualCoordinates] = useState<Coordinates | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const coordinates = manualCoordinates || geoCoordinates;

  const [mapIncidents, setMapIncidents] = useState<Array<{
    type: "fire" | "safety" | "traffic";
    lat: number;
    lng: number;
    description: string;
  }>>([]);

  const { 
    data: locationData,
    isLoading: locationLoading
  } = useQuery({
    queryKey: [
      '/api/location', 
      coordinates?.latitude, 
      coordinates?.longitude,
      refreshTrigger
    ],
    queryFn: () => 
      coordinates ? 
      fetchLocationInfo(coordinates.latitude, coordinates.longitude) : 
      Promise.reject("No coordinates"),
    enabled: !!coordinates,
  });


  useEffect(() => {
    if (locationData) {
      setLocationInfo(locationData);
    }
  }, [locationData]);

  
  const { 
    data: weatherData, 
    isLoading: weatherLoading 
  } = useQuery({
    queryKey: [
      '/api/weather', 
      coordinates?.latitude, 
      coordinates?.longitude, 
      refreshTrigger
    ],
    queryFn: () => 
      coordinates ? 
      fetchWeatherData(coordinates.latitude, coordinates.longitude) : 
      Promise.reject("No coordinates"),
    enabled: !!coordinates,
  });

  
  const { 
    data: environmentData, 
    isLoading: environmentLoading 
  } = useQuery({
    queryKey: [
      '/api/environment', 
      coordinates?.latitude, 
      coordinates?.longitude, 
      refreshTrigger
    ],
    queryFn: () => 
      coordinates ? 
      fetchEnvironmentData(coordinates.latitude, coordinates.longitude) : 
      Promise.reject("No coordinates"),
    enabled: !!coordinates,
  });

  const { 
    data: safetyData, 
    isLoading: safetyLoading 
  } = useQuery({
    queryKey: [
      '/api/safety', 
      coordinates?.latitude, 
      coordinates?.longitude, 
      refreshTrigger
    ],
    queryFn: () => 
      coordinates ? 
      fetchSafetyData(coordinates.latitude, coordinates.longitude) : 
      Promise.reject("No coordinates"),
    enabled: !!coordinates,
  });

  const { 
    data: fireData, 
    isLoading: fireLoading 
  } = useQuery({
    queryKey: [
      '/api/fire', 
      coordinates?.latitude, 
      coordinates?.longitude, 
      refreshTrigger
    ],
    queryFn: () => 
      coordinates ? 
      fetchFireData(coordinates.latitude, coordinates.longitude) : 
      Promise.reject("No coordinates"),
    enabled: !!coordinates,
  });

  const { 
    data: newsData, 
    isLoading: newsLoading 
  } = useQuery({
    queryKey: [
      '/api/news', 
      coordinates?.latitude, 
      coordinates?.longitude, 
      refreshTrigger
    ],
    queryFn: () => 
      coordinates ? 
      fetchNewsData(coordinates.latitude, coordinates.longitude) : 
      Promise.reject("No coordinates"),
    enabled: !!coordinates,
  });

  const { 
    data: trafficData, 
    isLoading: trafficLoading 
  } = useQuery({
    queryKey: [
      '/api/traffic', 
      coordinates?.latitude, 
      coordinates?.longitude, 
      refreshTrigger
    ],
    queryFn: () => 
      coordinates ? 
      fetchTrafficData(coordinates.latitude, coordinates.longitude) : 
      Promise.reject("No coordinates"),
    enabled: !!coordinates,
  });

  const switchToDeviceLocation = () => {
    setManualCoordinates(null);
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleRefresh = () => {
    if (manualCoordinates) {
      if (window.confirm("Return to your device's current location?")) {
        switchToDeviceLocation();
        return;
      }
    }
    
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const incidents = [];
    
    if (fireData && fireData.status !== "No Incidents") {
      const fireIncident = {
        type: "fire" as const,
        lat: coordinates?.latitude ? coordinates.latitude + (Math.random() * 0.01 - 0.005) : 0,
        lng: coordinates?.longitude ? coordinates.longitude + (Math.random() * 0.01 - 0.005) : 0,
        description: "Fire incident reported in this area"
      };
      incidents.push(fireIncident);
    }
  
    if (safetyData && (safetyData.level === "Moderate" || safetyData.level === "High")) {
      const incidentCount = safetyData.level === "High" ? 3 : 1;
      
      for (let i = 0; i < incidentCount; i++) {
        const safetyIncident = {
          type: "safety" as const,
          lat: coordinates?.latitude ? coordinates.latitude + (Math.random() * 0.02 - 0.01) : 0,
          lng: coordinates?.longitude ? coordinates.longitude + (Math.random() * 0.02 - 0.01) : 0,
          description: `Safety concern: ${safetyData.mostCommon}`
        };
        incidents.push(safetyIncident);
      }
    }
    
    if (trafficData && trafficData.incident) {
      const trafficIncident = {
        type: "traffic" as const,
        lat: coordinates?.latitude ? coordinates.latitude + (Math.random() * 0.015 - 0.0075) : 0,
        lng: coordinates?.longitude ? coordinates.longitude + (Math.random() * 0.015 - 0.0075) : 0,
        description: trafficData.incident
      };
      incidents.push(trafficIncident);
    }
    
    setMapIncidents(incidents);
  }, [coordinates, fireData, safetyData, trafficData]);

  const handleManualLocationSubmit = (coords: Coordinates) => {
    setManualCoordinates(coords);
  };

  if ((geoError && !geoLoading) && !manualCoordinates) {
    return <ManualLocationEntry onLocationSubmit={handleManualLocationSubmit} error={geoError} />;
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {coordinates && (
        <FullScreenMap
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          incidents={mapIncidents}
        />
      )}

      <div className="relative z-10 h-full overflow-auto">
        <Header 
          locationInfo={locationInfo} 
          isLoading={locationLoading || geoLoading} 
          onRefresh={handleRefresh}
          isManualLocation={!!manualCoordinates}
        />

        {manualCoordinates && (
          <div className="flex justify-center mt-2 mb-2">
            <button 
              onClick={switchToDeviceLocation}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-md transition-all"
            >
              <span className="material-icons text-white">my_location</span>
              Use my current location
            </button>
          </div>
        )}

        {/* Risk Cards Section */}
        <section className="container mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <WeatherCard data={weatherData || null} isLoading={weatherLoading} />
          <DisasterAlertCard 
            latitude={coordinates?.latitude || 0} 
            longitude={coordinates?.longitude || 0} 
            isLoading={!coordinates} 
          />
          <EnvironmentCard data={environmentData || null} isLoading={environmentLoading} />
          <SafetyCard data={safetyData || null} isLoading={safetyLoading} />
          <FireCard data={fireData || null} isLoading={fireLoading} />
          <NewsCard data={newsData || null} isLoading={newsLoading} />
          <TrafficCard data={trafficData || null} isLoading={trafficLoading} />
        </section>

        {/* AI Assistant */}
        {coordinates && (
          <AIAssistant 
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
          />
        )}
        
        
        <ManualLocationDialog onLocationSubmit={handleManualLocationSubmit} />
      </div>
    </div>
  );
}

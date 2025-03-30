import { FireData } from "@shared/types";

interface FireApiResponse {
  incidents: Array<{
    id: string;
    location: {
      latitude: number;
      longitude: number;
    };
    type: string;
    status: string;
    distance: number;
  }>;
  risk_level: number;
  fire_stations: Array<{
    name: string;
    distance: number;
  }>;
}

export const getFireData = async (latitude: number, longitude: number): Promise<FireData> => {
  try {
    
    
    const apiKey = process.env.FIRE_API_KEY || "";
    const response = await fetch(`https://api.emergencyreporting.com/v1/incidents?lat=${latitude}&lon=${longitude}&radius=10&key=${apiKey}`);
    const data: FireApiResponse = await response.json();
    
    const simulatedResponse: FireApiResponse = {
      incidents: [],
      risk_level: 15, 
      fire_stations: [
        { name: "Station 7", distance: 1.8 }
      ]
    };
    
    let status: "No Incidents" | "Caution" | "Danger";
    let statusText: string;
    
    if (simulatedResponse.incidents.length === 0) {
      status = "No Incidents";
      statusText = "No Incidents";
    } else if (simulatedResponse.incidents.length <= 2) {
      status = "Caution";
      statusText = "Active Incident";
    } else {
      status = "Danger";
      statusText = "Multiple Incidents";
    }
    
    let riskLevel: string;
    if (simulatedResponse.risk_level < 33) {
      riskLevel = "Low";
    } else if (simulatedResponse.risk_level < 66) {
      riskLevel = "Moderate";
    } else {
      riskLevel = "High";
    }
  
    let nearestStation = "Unknown";
    if (simulatedResponse.fire_stations.length > 0) {
      const nearest = simulatedResponse.fire_stations.reduce((prev, current) => 
        prev.distance < current.distance ? prev : current
      );
      nearestStation = `${nearest.name} - ${nearest.distance} miles away`;
    }
    
    const fireData: FireData = {
      statusText,
      status,
      riskLevel,
      riskPercentage: simulatedResponse.risk_level,
      nearestStation
    };
    
    return fireData;
  } catch (error) {
    console.error("Error fetching fire data:", error);
    throw new Error("Failed to fetch fire data");
  }
};

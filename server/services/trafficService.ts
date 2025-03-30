import { TrafficData } from "@shared/types";

interface TomTomTrafficResponse {
  flowSegmentData: {
    currentSpeed: number;
    freeFlowSpeed: number;
    confidence: number;
    currentTravelTime: number;
    freeFlowTravelTime: number;
  };
}

interface TomTomEVResponse {
  results: Array<{
    poi: {
      name: string;
      classifications: Array<{ code: string }>;
    };
    address: {
      streetName: string;
    };
    position: {
      lat: number;
      lon: number;
    };
    distance: number;
  }>;
}

function getTrafficStatus(currentSpeed: number, freeFlowSpeed: number): string {
  const ratio = currentSpeed / freeFlowSpeed;
  if (ratio > 0.8) return "Light";
  if (ratio > 0.6) return "Moderate";
  if (ratio > 0.4) return "Heavy";
  return "Severe";
}

async function getNearestEVStations(latitude: number, longitude: number): Promise<string> {
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey) {
    return "EV charging data unavailable";
  }

  try {
    const response = await fetch(
      `https://api.tomtom.com/search/2/categorySearch/electric-vehicle-charging.json?lat=${latitude}&lon=${longitude}&radius=5000&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`TomTom EV API error: ${response.statusText}`);
    }

    const data: TomTomEVResponse = await response.json();
    if (data.results.length === 0) {
      return "No nearby charging stations found";
    }

    const nearest = data.results[0];
    return `Nearest charging station: ${nearest.poi.name} (${nearest.address.streetName}, ${Math.round(nearest.distance)}m away)`;
  } catch (error) {
    console.error("Error fetching EV station data:", error);
    return "EV charging data unavailable";
  }
}

export const getTrafficData = async (latitude: number, longitude: number): Promise<TrafficData> => {
  console.log(`Fetching traffic data from TomTom for ${latitude}, ${longitude}`);

  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey) {
    console.error("TomTom API key is missing");
    return {
      statusText: "Moderate",
      commuteTime: "15-20 mins",
      incident: "Unable to fetch real-time traffic data",
      publicTransit: "Check local schedule",
      bestTime: "Check traffic apps",
      evCharging: "EV charging data unavailable"
    };
  }

  try {
  
    const flowResponse = await fetch(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative/10/json?point=${latitude},${longitude}&key=${apiKey}`
    );

    if (!flowResponse.ok) {
      throw new Error(`TomTom API error: ${flowResponse.statusText}`);
    }

    const flowData: TomTomTrafficResponse = await flowResponse.json();

    
    const status = getTrafficStatus(
      flowData.flowSegmentData.currentSpeed,
      flowData.flowSegmentData.freeFlowSpeed
    );

    const commuteTime = Math.round(flowData.flowSegmentData.currentTravelTime / 60);
    const normalTime = Math.round(flowData.flowSegmentData.freeFlowTravelTime / 60);

    
    const evChargingInfo = await getNearestEVStations(latitude, longitude);

    return {
      statusText: status,
      commuteTime: `${commuteTime} mins (normally ${normalTime} mins)`,
      incident: status === "Severe" ? "Heavy traffic conditions" : "No major incidents reported",
      bestTime: status === "Heavy" || status === "Severe" ? "After 7pm" : "Current time is good",
      evCharging: evChargingInfo
    };
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    return {
      statusText: "Moderate",
      commuteTime: "15-20 mins",
      incident: "Unable to fetch real-time traffic data",
      publicTransit: "Check local schedule",
      bestTime: "Check traffic apps",
      evCharging: "EV charging data unavailable"
    };
  }
};
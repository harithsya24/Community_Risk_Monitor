import { DisasterAlertData } from "@shared/types";

interface PirateWeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  currently: {
    time: number;
    summary: string;
    icon: string;
    precipIntensity: number;
    precipProbability: number;
    precipType?: string;
    temperature: number;
    apparentTemperature: number;
    dewPoint: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windGust: number;
    windBearing: number;
    cloudCover: number;
    uvIndex: number;
    visibility: number;
    ozone: number;
  };
  alerts?: Array<{
    title: string;
    time: number;
    expires: number;
    description: string;
    uri: string;
    severity: "advisory" | "watch" | "warning";
    regions: string[];
  }>;
}

/**
 * Determines the alert level based on the severity of weather alerts
 * @param alerts Array of weather alerts from the API
 * @returns Alert level as a string
 */
const determineAlertLevel = (alerts: Array<{severity: string}>): "None" | "Advisory" | "Watch" | "Warning" => {
  if (!alerts || alerts.length === 0) {
    return "None";
  }
  
  const hasWarning = alerts.some(alert => alert.severity === "warning");
  const hasWatch = alerts.some(alert => alert.severity === "watch");
  
  if (hasWarning) {
    return "Warning";
  } else if (hasWatch) {
    return "Watch";
  } else {
    return "Advisory";
  }
};


const getStatusColor = (level: "None" | "Advisory" | "Watch" | "Warning"): string => {
  switch (level) {
    case "Warning": return "red";
    case "Watch": return "orange";
    case "Advisory": return "yellow";
    default: return "green";
  }
};


const getRecommendations = (alerts: Array<{
  title: string;
  severity: string;
  description: string;
}>): string => {
  if (!alerts || alerts.length === 0) {
    return "No active weather alerts. Continue with normal activities.";
  }
  
  
  let highestSeverityAlert = alerts[0];
  for (const alert of alerts) {
    if (alert.severity === "warning" && highestSeverityAlert.severity !== "warning") {
      highestSeverityAlert = alert;
    } else if (alert.severity === "watch" && highestSeverityAlert.severity === "advisory") {
      highestSeverityAlert = alert;
    }
  }
  
  
  const title = highestSeverityAlert.title.toLowerCase();
  
  if (title.includes("flood")) {
    return "Avoid low-lying areas and stay away from streams, rivers, and creeks. Do not drive through flooded roads.";
  } else if (title.includes("thunder") || title.includes("lightning")) {
    return "Seek indoor shelter immediately. Stay away from windows and avoid using electrical appliances or plumbing.";
  } else if (title.includes("tornado")) {
    return "Seek shelter in a basement or interior room on the lowest floor. Stay away from windows and protect your head.";
  } else if (title.includes("winter") || title.includes("snow") || title.includes("ice")) {
    return "Limit travel and stay indoors if possible. If you must travel, keep an emergency kit in your vehicle.";
  } else if (title.includes("heat")) {
    return "Stay in air-conditioned areas, drink plenty of fluids, and limit outdoor activities during the hottest part of the day.";
  } else if (title.includes("wind")) {
    return "Secure loose outdoor objects, stay away from windows, and be cautious when driving high-profile vehicles.";
  } else {
    
    return "Stay informed and follow instructions from local authorities. Prepare an emergency kit and have a plan in place.";
  }
};


export const getDisasterAlertData = async (latitude: number, longitude: number): Promise<DisasterAlertData> => {
  try {
    const apiKey = process.env.PIRATEWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("Pirate Weather API key is missing");
    }
    
    console.log(`Fetching disaster alert data from Pirate Weather for ${latitude}, ${longitude}`);
    const response = await fetch(
      `https://api.pirateweather.net/forecast/${apiKey}/${latitude},${longitude}`
    );
    
    if (!response.ok) {
      throw new Error(`Pirate Weather API returned status ${response.status}`);
    }
    
    const data: PirateWeatherResponse = await response.json();
    
    const alerts = data.alerts || [];
    
    const alertLevel = determineAlertLevel(alerts);
    
    const alertItems = alerts.map(alert => ({
      title: alert.title,
      description: alert.description.split('.')[0] + '.', 
      type: alert.severity,
      expires: new Date(alert.expires * 1000).toLocaleString(),
      regions: alert.regions.join(', ')
    }));
    
    
    const currentConditions = data.currently;
    let potentialHazards: string[] = [];
    
    
    if (currentConditions.windSpeed > 25) {
      potentialHazards.push("Strong winds");
    }
    
    if (currentConditions.precipIntensity > 0.4 && currentConditions.precipProbability > 0.8) {
      potentialHazards.push("Heavy precipitation");
    }
    
    if (currentConditions.visibility < 1) {
      potentialHazards.push("Low visibility");
    }
    
    if (currentConditions.temperature > 95) {
      potentialHazards.push("Extreme heat");
    }
    
    if (currentConditions.temperature < 20) {
      potentialHazards.push("Extreme cold");
    }
    
    
    if (alertItems.length === 0 && potentialHazards.length > 0) {
      alertItems.push({
        title: "Potential Weather Hazard",
        description: `Current conditions indicate possible ${potentialHazards.join(', ')}.`,
        type: "advisory",
        expires: "Unknown",
        regions: "Your area"
      });
    }
    
    
    const disasterAlertData: DisasterAlertData = {
      statusText: alertLevel === "None" ? "No Alerts" : `${alertLevel} In Effect`,
      status: alertLevel,
      statusColor: getStatusColor(alertLevel),
      recommendations: getRecommendations(alerts),
      alerts: alertItems,
      lastUpdated: new Date().toLocaleString()
    };
    
    return disasterAlertData;
  } catch (error) {
    console.error("Error fetching disaster alert data:", error);
    
    
    return {
      statusText: "Alert Status Unknown",
      status: "None",
      statusColor: "gray",
      recommendations: "Unable to retrieve alert data. Please check official weather services for information.",
      alerts: [],
      lastUpdated: new Date().toLocaleString()
    };
  }
};
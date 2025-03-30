import { EnvironmentData } from "@shared/types";

interface OpenWeatherAirPollutionResponse {
  coord: {
    lon: number;
    lat: number;
  };
  list: [
    {
      main: {
        aqi: number; 
      };
      components: {
        co: number;    
        no: number;    
        no2: number; 
        o3: number;    
        so2: number;   
        pm2_5: number; 
        pm10: number;  
        nh3: number;  
      };
      dt: number;     
    }
  ];
}

const convertAQI = (openWeatherAQI: number): number => {
  
  switch (openWeatherAQI) {
    case 1: return 30;  
    case 2: return 75;  
    case 3: return 125; 
    case 4: return 175; 
    case 5: return 300; 
    default: return 50; 
  }
};

const getAirQualityText = (aqi: number): string => {
  if (aqi <= 50) {
    return "Good";
  } else if (aqi <= 100) {
    return "Moderate";
  } else if (aqi <= 150) {
    return "Unhealthy for Sensitive Groups";
  } else if (aqi <= 200) {
    return "Unhealthy";
  } else if (aqi <= 300) {
    return "Very Unhealthy";
  } else {
    return "Hazardous";
  }
};

const getRecommendation = (aqi: number): string => {
  if (aqi <= 50) {
    return "Air quality is good. It's a great day for outdoor activities.";
  } else if (aqi <= 100) {
    return "Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion.";
  } else if (aqi <= 150) {
    return "Members of sensitive groups may experience health effects. Reduce prolonged or heavy outdoor exertion.";
  } else if (aqi <= 200) {
    return "Everyone may begin to experience health effects. Sensitive groups should avoid prolonged outdoor exertion.";
  } else if (aqi <= 300) {
    return "Health warnings of emergency conditions. Everyone should avoid outdoor activities.";
  } else {
    return "Health alert: everyone may experience more serious health effects. Avoid all outdoor physical activities.";
  }
};

const calculateAQIFromOzone = (ozoneDU: number): number => {
  if (ozoneDU < 280) return 25;      
  if (ozoneDU < 330) return 50;     
  if (ozoneDU < 370) return 75;      
  if (ozoneDU < 400) return 125;     
  if (ozoneDU < 430) return 175;    
  if (ozoneDU < 450) return 250;     
  return 350;                        
};

const convertDUtoPPB = (ozoneDU: number): number => {
  
  return Math.round(ozoneDU / 10);
};

const estimatePM25 = (visibility: number, cloudCover: number): number => {
  let basePM25 = 0;
  
  if (visibility >= 10) {
    basePM25 = 5;  
  } else if (visibility >= 7) {
    basePM25 = 12; 
  } else if (visibility >= 5) {
    basePM25 = 25; 
  } else if (visibility >= 3) {
    basePM25 = 35; 
  } else if (visibility >= 1) {
    basePM25 = 55; 
  } else {
    basePM25 = 75; 
  }
  
  const cloudAdjustment = -10 * cloudCover; 
  
  return Math.max(5, basePM25 + cloudAdjustment);
};

export const getEnvironmentData = async (latitude: number, longitude: number): Promise<EnvironmentData> => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY || "";
    if (!apiKey) {
      throw new Error("OpenWeather API key is missing");
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`OpenWeather API returned status ${response.status}`);
    }
    
    const data: OpenWeatherAirPollutionResponse = await response.json();
    
    const airQualityData = data.list[0];
    const openWeatherAQI = airQualityData.main.aqi;
    const pm25Value = airQualityData.components.pm2_5;
    const ozoneValue = airQualityData.components.o3;
    
    const convertedAQI = convertAQI(openWeatherAQI);
    
    const pm25Percentage = Math.min((pm25Value / 55.4) * 100, 100);
    
    
    const ozoneValuePPB = Math.round(ozoneValue / 2);
    const ozonePercentage = Math.min((ozoneValuePPB / 85) * 100, 100);
    
    const environmentData: EnvironmentData = {
      airQualityText: getAirQualityText(convertedAQI),
      airQualityIndex: convertedAQI,
      recommendation: getRecommendation(convertedAQI),
      pm25: `${pm25Value.toFixed(1)} µg/m³`,
      pm25Percentage,
      ozone: `${ozoneValuePPB} ppb`,
      ozonePercentage
    };
    
    return environmentData;
  } catch (error) {
    console.error("Error fetching environment data:", error);
    
    return {
      airQualityText: "Data Unavailable",
      airQualityIndex: 0,
      recommendation: "Unable to retrieve air quality data. Please try again later.",
      pm25: "N/A",
      pm25Percentage: 0,
      ozone: "N/A",
      ozonePercentage: 0
    };
  }
};

import { WeatherData } from "@shared/types";


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
  hourly: {
    summary: string;
    icon: string;
    data: Array<{
      time: number;
      summary: string;
      icon: string;
      precipIntensity: number;
      precipProbability: number;
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
    }>;
  };
  daily: {
    summary: string;
    icon: string;
    data: Array<{
      time: number;
      summary: string;
      icon: string;
      sunriseTime: number;
      sunsetTime: number;
      moonPhase: number;
      precipIntensity: number;
      precipIntensityMax: number;
      precipIntensityMaxTime: number;
      precipProbability: number;
      precipType: string;
      temperatureHigh: number;
      temperatureHighTime: number;
      temperatureLow: number;
      temperatureLowTime: number;
      apparentTemperatureHigh: number;
      apparentTemperatureHighTime: number;
      apparentTemperatureLow: number;
      apparentTemperatureLowTime: number;
      dewPoint: number;
      humidity: number;
      pressure: number;
      windSpeed: number;
      windGust: number;
      windGustTime: number;
      windBearing: number;
      cloudCover: number;
      uvIndex: number;
      uvIndexTime: number;
      visibility: number;
      ozone: number;
      temperatureMin: number;
      temperatureMinTime: number;
      temperatureMax: number;
      temperatureMaxTime: number;
      apparentTemperatureMin: number;
      apparentTemperatureMinTime: number;
      apparentTemperatureMax: number;
      apparentTemperatureMaxTime: number;
    }>;
  };
}

const getItemsToCarry = (conditions: string, temp: number): string[] => {
  const items: string[] = [];
  const lowercaseConditions = conditions.toLowerCase();

  if (lowercaseConditions.includes('rain') || lowercaseConditions.includes('drizzle')) {
    items.push('Umbrella', 'Rain boots');
  }

  if (lowercaseConditions.includes('thunder') || lowercaseConditions.includes('lightning')) {
    items.push('Stay indoors if possible');
  }

  if (lowercaseConditions.includes('sun') || lowercaseConditions.includes('clear')) {
    items.push('Sunglasses', 'Hat', 'Sunscreen');
  }

  if (temp < 40) {
    items.push('Gloves', 'Warm hat');
  }

  return items;
};

const getOutfitSuggestion = (temp: number, conditions: string): string => {
  if (temp > 85) {
    return "Light clothing recommended. Stay hydrated and consider a hat for sun protection.";
  } else if (temp > 70) {
    return "T-shirt and shorts or light pants are ideal. Consider a light jacket for the evening.";
  } else if (temp > 60) {
    return "Long sleeves and pants recommended. A light jacket may be needed.";
  } else if (temp > 40) {
    return "Jacket, sweater, and pants are recommended. Consider layering for comfort.";
  } else {
    return "Heavy coat, hat, scarf, and gloves are recommended. Layer clothing for warmth.";
  }
};

const getWeatherIcon = (condition: string): string => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("sun") || conditionLower.includes("clear")) {
    return "wb_sunny";
  } else if (conditionLower.includes("cloud")) {
    return "cloud";
  } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return "water_drop";
  } else if (conditionLower.includes("snow")) {
    return "ac_unit";
  } else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    return "filter_drama";
  } else if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return "thunderstorm";
  } else {
    return "wb_sunny";
  }
};

const extractWindSpeed = (windSpeedStr: string): number => {
  const matches = windSpeedStr.match(/\d+/g);
  if (!matches) return 0;

  if (matches.length > 1) {
    const min = parseInt(matches[0]);
    const max = parseInt(matches[1]);
    return Math.round((min + max) / 2);
  }

  return parseInt(matches[0]);
};


const estimateUVIndex = (conditions: string, isDaytime: boolean): number => {
  const conditionLower = conditions.toLowerCase();

  if (!isDaytime) return 0;

  if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
    return 7;
  } else if (conditionLower.includes("partly") && conditionLower.includes("cloud")) {
    return 5;
  } else if (conditionLower.includes("cloud")) {
    return 3;
  } else if (conditionLower.includes("rain") || conditionLower.includes("shower")) {
    return 2;
  } else {
    return 4; 
  }
};


const extractHumidity = (detailedForecast: string): number => {
  const matches = detailedForecast.match(/humidity (?:is )?around (\d+)%/i);
  if (matches && matches.length > 1) {
    return parseInt(matches[1]);
  }

  return 45;
};

interface WeatherData {
  temperature: number;
  conditions: string;
  high: number;
  low: number;
  feelsLike: number;
  outfitSuggestion: string;
  itemsToCarry: string[];
  humidity: number;
  wind: number;
  uvIndex: number;
  icon: string;
}

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {

    const apiKey = process.env.PIRATEWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("Pirate Weather API key is missing");
    }

    console.log(`Fetching weather data from Pirate Weather for ${latitude}, ${longitude}`);
    const response = await fetch(
      `https://api.pirateweather.net/forecast/${apiKey}/${latitude},${longitude}`
    );

    if (!response.ok) {
      throw new Error(`Pirate Weather API returned status ${response.status}`);
    }

    const data: PirateWeatherResponse = await response.json();

    
    const current = data.currently;
    const todayForecast = data.daily.data[0];

    let conditions = current.summary;
    if (!conditions) {
      
      switch (current.icon) {
        case "clear-day": conditions = "Clear"; break;
        case "clear-night": conditions = "Clear"; break;
        case "rain": conditions = "Rain"; break;
        case "snow": conditions = "Snow"; break;
        case "sleet": conditions = "Sleet"; break;
        case "wind": conditions = "Windy"; break;
        case "fog": conditions = "Foggy"; break;
        case "cloudy": conditions = "Cloudy"; break;
        case "partly-cloudy-day": conditions = "Partly Cloudy"; break;
        case "partly-cloudy-night": conditions = "Partly Cloudy"; break;
        default: conditions = "Weather data available"; break;
      }
    }

    
    const currentTemp = Math.round(current.temperature);
    const feelsLike = Math.round(current.apparentTemperature);
    const high = Math.round(todayForecast.temperatureHigh);
    const low = Math.round(todayForecast.temperatureLow);

    const humidity = Math.round(current.humidity * 100);

    const windSpeed = Math.round(current.windSpeed);

    const uvIndex = current.uvIndex;

    const icon = getWeatherIcon(conditions);

    const weatherData: WeatherData = {
      temperature: currentTemp,
      conditions,
      high,
      low,
      feelsLike,
      outfitSuggestion: getOutfitSuggestion(currentTemp, conditions),
      itemsToCarry: getItemsToCarry(conditions, currentTemp),
      humidity,
      wind: windSpeed,
      uvIndex,
      icon
    };

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
};
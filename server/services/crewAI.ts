import {
  WeatherData,
  EnvironmentData,
  SafetyData,
  FireData,
  NewsData,
  TrafficData
} from "@shared/types";
import { getWeatherData } from "./weatherService";
import { getEnvironmentData } from "./environmentService";
import { getSafetyData } from "./safetyService";
import { getFireData } from "./fireService";
import { getNewsData } from "./newsService";
import { getTrafficData } from "./trafficService";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getBackgroundImage = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const weatherData = await getWeatherData(latitude, longitude);
    const conditions = weatherData.conditions.toLowerCase();
    
    if (conditions.includes("rain") || conditions.includes("shower")) {
      return "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&h=800";
    } else if (conditions.includes("cloud")) {
      return "https://images.unsplash.com/photo-1513172128806-2d00531a9f20?auto=format&fit=crop&w=1200&h=800";
    } else if (conditions.includes("snow")) {
      return "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1200&h=800";
    } else if (conditions.includes("fog") || conditions.includes("mist")) {
      return "https://images.unsplash.com/photo-1482841628122-9080d44bb807?auto=format&fit=crop&w=1200&h=800";
    } else {
      return "https://images.unsplash.com/photo-1617839997367-13bbe4790e6d?auto=format&fit=crop&w=1200&h=800";
    }
  } catch (error) {
    console.error("Error selecting background image:", error);
    return "https://images.unsplash.com/photo-1617839997367-13bbe4790e6d?auto=format&fit=crop&w=1200&h=800";
  }
};

export const processChatMessage = async (
  message: string,
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    console.log("Processing chat message with AI experts...");
    const weatherData = await getWeatherData(latitude, longitude);
    const environmentData = await getEnvironmentData(latitude, longitude);
    const safetyData = await getSafetyData(latitude, longitude);
    const fireData = await getFireData(latitude, longitude);
    const trafficData = await getTrafficData(latitude, longitude);
    const newsData = await getNewsData(latitude, longitude);
    
    
    
    let newsContext = "Recent local news: ";
    if (newsData.items.length === 0) {
      newsContext += "No significant local news at this time.";
    } else {
      newsData.items.forEach((item, index) => {
        newsContext += `${index + 1}) ${item.title} - ${item.description} (${item.location}). `;
      });
    }
    
    
    const contextMessage = `
You are Attila, a duck assistant who coordinates a team of specialized experts to provide helpful, accurate information about location-based risks and conditions.

You have a team of experts who have provided you with the following real-time data for ${locationName} (lat: ${latitude}, long: ${longitude}):

FROM THE WEATHER & OUTFIT EXPERT:
- Current temp: ${weatherData.temperature}°F (feels like ${weatherData.feelsLike}°F)
- Conditions: ${weatherData.conditions}
- High/Low: ${weatherData.high}°F/${weatherData.low}°F
- Outfit suggestion: ${weatherData.outfitSuggestion}
- Humidity: ${weatherData.humidity}%, Wind: ${weatherData.wind}mph, UV Index: ${weatherData.uvIndex}

FROM THE ENVIRONMENTAL RISK ANALYST:
- Air Quality: ${environmentData.airQualityText} (AQI: ${environmentData.airQualityIndex})
- PM2.5: ${environmentData.pm25} (${environmentData.pm25Percentage}% of safe level)
- Ozone: ${environmentData.ozone} (${environmentData.ozonePercentage}% of safe level)
- Health recommendation: ${environmentData.recommendation}

FROM THE SAFETY & CRIME ANALYST:
- Current level: ${safetyData.levelText}
- Recent incidents: ${safetyData.recentIncidents}
- Most common incident: ${safetyData.mostCommon}
- Safety tip: ${safetyData.tips}

FROM THE FIRE RISK EXPERT:
- Status: ${fireData.statusText}
- Risk level: ${fireData.riskLevel} (${fireData.riskPercentage}% risk)
- Nearest fire station: ${fireData.nearestStation}

FROM THE TRAFFIC & COMMUTE ADVISOR:
- Current conditions: ${trafficData.statusText}
- Commute time: ${trafficData.commuteTime}
- Incidents: ${trafficData.incident || "None reported"}
- Public transit: ${trafficData.publicTransit}
- Best travel time: ${trafficData.bestTime}

FROM THE LOCAL NEWS REPORTER:
${newsContext}

Your responses should be friendly, concise, and occasionally include subtle duck-related puns or phrases when appropriate.
Answer the user's questions by drawing from the relevant expert data above. Only include information that's relevant to the user's query.
Speak casually as if you're a friendly duck who happens to coordinate a team of experts about the area.
Don't mention "API", "data", or "experts" in your answer - instead, present the information as if you gathered it yourself.
`;

    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: contextMessage },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    
    return completion.choices[0].message.content || "Quack! I seem to be having trouble responding right now. Could you try again?";
  } catch (error) {
    console.error("Error processing chat message:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try asking again in a slightly different way.";
  }
};
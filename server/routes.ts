import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getWeatherData } from "./services/weatherService";
import { getEnvironmentData } from "./services/environmentService";
import { getSafetyData } from "./services/safetyService";
import { getFireData } from "./services/fireService";
import { getNewsData } from "./services/newsService";
import { getTrafficData } from "./services/trafficService";
import { getDisasterAlertData } from "./services/disasterAlertService";
import { getBackgroundImage, processChatMessage } from "./services/crewAI";

export async function registerRoutes(app: Express): Promise<Server> {

  app.get("/api/location", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
    
      let locationName = "Unknown Location";
      
      if (latitude >= 40.735 && latitude <= 40.748 && 
          longitude >= -74.035 && longitude <= -74.020) {
        locationName = "Hoboken, NJ";
      } 
      else if (latitude >= 40.70 && latitude <= 40.78 && 
               longitude >= -74.02 && longitude <= -73.95) {
        locationName = "New York, NY";
      }
      else if (latitude >= 37.75 && latitude <= 37.80 && 
               longitude >= -122.45 && longitude <= -122.40) {
        locationName = "San Francisco, CA";
      }
      else if (latitude >= 51.50 && latitude <= 51.52 && 
               longitude >= -0.13 && longitude <= -0.12) {
        locationName = "London, UK";
      }
      else if (latitude >= 35.67 && latitude <= 35.68 && 
               longitude >= 139.64 && longitude <= 139.66) {
        locationName = "Tokyo, Japan";
      }
      else if (latitude >= -33.87 && latitude <= -33.86 && 
               longitude >= 151.20 && longitude <= 151.22) {
        locationName = "Sydney, Australia";
      }
      console.log(`Coordinates (${latitude}, ${longitude}) identified as: ${locationName}`);
      
      const locationInfo = {
        name: locationName,
        latitude,
        longitude
      };
      
      res.json(locationInfo);
    } catch (error) {
      console.error("Error retrieving location:", error);
      res.status(500).json({ error: "Failed to retrieve location information" });
    }
  });
  
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      const weatherData = await getWeatherData(latitude, longitude);
      res.json(weatherData);
    } catch (error) {
      console.error("Error retrieving weather data:", error);
      res.status(500).json({ error: "Failed to retrieve weather data" });
    }
  });
  
  app.get("/api/environment", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      const environmentData = await getEnvironmentData(latitude, longitude);
      res.json(environmentData);
    } catch (error) {
      console.error("Error retrieving environment data:", error);
      res.status(500).json({ error: "Failed to retrieve environment data" });
    }
  });
  
  app.get("/api/safety", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      const safetyData = await getSafetyData(latitude, longitude);
      res.json(safetyData);
    } catch (error) {
      console.error("Error retrieving safety data:", error);
      res.status(500).json({ error: "Failed to retrieve safety data" });
    }
  });
  
  app.get("/api/fire", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      const fireData = await getFireData(latitude, longitude);
      res.json(fireData);
    } catch (error) {
      console.error("Error retrieving fire data:", error);
      res.status(500).json({ error: "Failed to retrieve fire data" });
    }
  });
  
  app.get("/api/news", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      const newsData = await getNewsData(latitude, longitude);
      res.json(newsData);
    } catch (error) {
      console.error("Error retrieving news data:", error);
      res.status(500).json({ error: "Failed to retrieve news data" });
    }
  });
  
  app.get("/api/traffic", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      const trafficData = await getTrafficData(latitude, longitude);
      res.json(trafficData);
    } catch (error) {
      console.error("Error retrieving traffic data:", error);
      res.status(500).json({ error: "Failed to retrieve traffic data" });
    }
  });
  
  app.get("/api/background", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      const backgroundImage = await getBackgroundImage(latitude, longitude);
      res.json(backgroundImage);
    } catch (error) {
      console.error("Error retrieving background image:", error);
      res.status(500).json({ error: "Failed to retrieve background image" });
    }
  });
  
  app.get("/api/disaster-alerts", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      const disasterAlertData = await getDisasterAlertData(latitude, longitude);
      res.json(disasterAlertData);
    } catch (error) {
      console.error("Error retrieving disaster alert data:", error);
      res.status(500).json({ error: "Failed to retrieve disaster alert data" });
    }
  });
  
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, latitude, longitude } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      if (!latitude || !longitude) {
        return res.status(400).json({ error: "Location coordinates are required" });
      }
      
      const response = await processChatMessage(message, latitude, longitude);
      res.json({ message: response });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

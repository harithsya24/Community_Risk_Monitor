import { apiRequest } from "@/lib/queryClient";
import type {
  WeatherData,
  EnvironmentData,
  SafetyData,
  FireData,
  NewsData,
  TrafficData,
  LocationInfo,
  CrewAIResponse,
  DisasterAlertData,
} from "@shared/types";

export const fetchLocationInfo = async (
  latitude: number,
  longitude: number
): Promise<LocationInfo> => {
  const response = await apiRequest(
    "GET",
    `/api/location?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  const response = await apiRequest(
    "GET",
    `/api/weather?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const fetchEnvironmentData = async (
  latitude: number,
  longitude: number
): Promise<EnvironmentData> => {
  const response = await apiRequest(
    "GET",
    `/api/environment?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const fetchSafetyData = async (
  latitude: number,
  longitude: number
): Promise<SafetyData> => {
  const response = await apiRequest(
    "GET",
    `/api/safety?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const fetchFireData = async (
  latitude: number,
  longitude: number
): Promise<FireData> => {
  const response = await apiRequest(
    "GET",
    `/api/fire?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const fetchNewsData = async (
  latitude: number,
  longitude: number
): Promise<NewsData> => {
  const response = await apiRequest(
    "GET",
    `/api/news?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const fetchTrafficData = async (
  latitude: number,
  longitude: number
): Promise<TrafficData> => {
  const response = await apiRequest(
    "GET",
    `/api/traffic?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const fetchBackgroundImage = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  const response = await apiRequest(
    "GET",
    `/api/background?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const fetchDisasterAlertData = async (
  latitude: number,
  longitude: number
): Promise<DisasterAlertData> => {
  const response = await apiRequest(
    "GET",
    `/api/disaster-alerts?lat=${latitude}&lon=${longitude}`,
    undefined
  );
  return response.json();
};

export const sendChatMessage = async (
  message: string,
  latitude: number,
  longitude: number
): Promise<CrewAIResponse> => {
  const response = await apiRequest(
    "POST",
    "/api/chat",
    { message, latitude, longitude }
  );
  return response.json();
};

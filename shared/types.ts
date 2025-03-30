export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  name: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  temperature: number;
  conditions: string;
  high: number;
  low: number;
  feelsLike: number;
  outfitSuggestion: string;
  humidity: number;
  wind: number;
  uvIndex: number;
  icon: string;
}

export interface EnvironmentData {
  airQualityText: string;
  airQualityIndex: number;
  recommendation: string;
  pm25: string;
  pm25Percentage: number;
  ozone: string;
  ozonePercentage: number;
}

export interface SafetyData {
  levelText: string;
  level: "Low" | "Moderate" | "High";
  tips: string;
  recentIncidents: string;
  mostCommon: string;
}

export interface FireData {
  statusText: string;
  status: "No Incidents" | "Caution" | "Danger";
  riskLevel: string;
  riskPercentage: number;
  nearestStation: string;
}

export interface NewsItem {
  title: string;
  time: string;
  description: string;
  location: string;
}

export interface NewsData {
  items: NewsItem[];
}

export interface TrafficData {
  statusText: string;
  commuteTime: string;
  incident: string;
  publicTransit: string;
  bestTime: string;
  evCharging: string;
}

export interface BackgroundImage {
  url: string;
  weatherCondition: string;
}

export interface ChatMessage {
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

export interface CrewAIResponse {
  message: string;
}

export interface DisasterAlertData {
  statusText: string;
  status: "None" | "Advisory" | "Watch" | "Warning";
  statusColor: string;
  recommendations: string;
  alerts: Array<{
    title: string;
    description: string;
    type: string;
    expires: string;
    regions: string;
  }>;
  lastUpdated: string;
}

# Community Risk Monitor

A real-time community safety and risk monitoring application that provides up-to-date information about various risks and conditions in your area.

## Features

- **Real-time location-based monitoring**: Get updated information based on your location.
- **Fire incident tracking**: Monitor nearby fire incidents.
- **Safety and crime statistics**: View crime data and safety reports in your area.
- **Weather conditions and alerts**: Stay informed about local weather and receive alerts.
- **Traffic updates**: Access real-time traffic conditions and updates.
- **Local community news**: Stay connected with current local news.
- **Voice-activated interface ("Hey Attila")**: Activate the app and interact with it using voice commands.
- **Environmental conditions**: Get real-time updates on environmental data such as air quality.
- **Disaster alerts**: Receive alerts for natural disasters in your area.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **AI Agents Architecture**: CrewAI
- **UI**: Tailwind CSS + Radix UI
- **Maps**: Leaflet, Google Maps
- **Voice Recognition**: Web Speech API

## Getting Started

Follow these instructions to get the project up and running locally:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/community-risk-monitor.git
```

### 2. Install dependencies

Navigate to the project directory and install the required dependencies:
```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root of the project and add the following environment variables like WEATHER_API_KEY, CRIME_API_KEY,NEWS_API_KEY, TRAFFIC_API_KEY.

### 4. Start the development server

To run the application locally, start the development server with:
```bash
npm run dev
```

This will launch the application at http://localhost:3000 or another port depending on your configuration.

## API Services

The application integrates with several third-party services:
	•	Pirate Weather API: Provides weather data and alerts.
	•	News API: Fetches local news based on your location.
	•	TomTom API: Supplies traffic information and road conditions.
	•	Crime Data APIs: Aggregates safety and crime-related statistics.

 ## Voice Commands

The application responds to the voice command “Hey Attila” to activate the AI assistant interface. After activation, you can ask questions or get updates about local conditions like traffic, weather, or crime.


## Contributors

We would like to thank the following contributors for their time and effort in helping develop the Community Risk Monitor:
	•	Amrutha Kanakatte Ravishankar (akanakat@stevens.edu)
	•	Sneha Venkatesh (svenkate1@stevens.edu)
	•	Hemanth Pillala (hpillala@stevens.edu)
  • Nisha Thaluru Gopi (nthaluru@stevens.edu)

If you’d like to be added as a contributor, please submit a pull request with your contributions!

## License

This project is licensed under the MIT License - see the LICENSE file for details.



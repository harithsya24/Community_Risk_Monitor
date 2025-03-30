import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface FullScreenMapProps {
  latitude: number;
  longitude: number;
  incidents?: Array<{
    type: "fire" | "safety" | "traffic";
    lat: number;
    lng: number;
    description: string;
  }>;
}

export default function FullScreenMap({ latitude, longitude, incidents = [] }: FullScreenMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !latitude || !longitude) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,  
        attributionControl: false 
      }).setView([latitude, longitude], 12);
      
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapRef.current);
      
      L.control.attribution({
        position: 'bottomleft'
      }).addTo(mapRef.current);
    } else {
    
      mapRef.current.setView([latitude, longitude], 12);
    }
    mapRef.current.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `<div class="w-6 h-6 rounded-full bg-primary-dark border-2 border-white flex items-center justify-center shadow-lg">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker([latitude, longitude], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup("Your location");

    incidents.forEach(incident => {
      let markerColor = '';
      
      switch(incident.type) {
        case 'fire':
          markerColor = 'bg-danger';
          break;
        case 'safety':
          markerColor = 'bg-alert';
          break;
        case 'traffic':
          markerColor = 'bg-primary';
          break;
      }
      
      const incidentIcon = L.divIcon({
        className: 'incident-marker',
        html: `<div class="w-5 h-5 ${markerColor} rounded-full border-2 border-white shadow-md"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      L.marker([incident.lat, incident.lng], { icon: incidentIcon })
        .addTo(mapRef.current!)
        .bindPopup(incident.description);
    });

    return () => {
    };
  }, [latitude, longitude, incidents]);

  return (
    <div className="fixed inset-0 z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
}
import { useEffect, useRef } from "react";
import L from "leaflet";

interface MapSectionProps {
  latitude: number;
  longitude: number;
  incidents?: Array<{
    type: "fire" | "safety" | "traffic";
    lat: number;
    lng: number;
    description: string;
  }>;
}

export default function MapSection({ latitude, longitude, incidents = [] }: MapSectionProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !latitude || !longitude) return;

    
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 13);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else {
      
      mapRef.current.setView([latitude, longitude], 13);
    }

    
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `<div class="w-6 h-6 rounded-full bg-primary-dark border-2 border-white flex items-center justify-center">
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
        html: `<div class="w-5 h-5 ${markerColor} rounded-full border-2 border-white"></div>`,
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

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };

  const handleLocate = () => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.setView([latitude, longitude], 13);
    }
  };

  return (
    <section className="container mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-800">Your Area</h2>
          <p className="text-sm text-neutral-600">Showing risks and incidents near you</p>
        </div>
        <div className="relative h-64 md:h-80">
          <div ref={mapContainerRef} className="absolute inset-0" />
          
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[400]">
            <button 
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-neutral-100"
              aria-label="Zoom in"
            >
              <span className="material-icons text-neutral-700">add</span>
            </button>
            <button 
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-neutral-100"
              aria-label="Zoom out"
            >
              <span className="material-icons text-neutral-700">remove</span>
            </button>
            <button 
              onClick={handleLocate}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-neutral-100"
              aria-label="My location"
            >
              <span className="material-icons text-neutral-700">my_location</span>
            </button>
          </div>
          
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md z-[400]">
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger"></div>
                <span>Fire Incident</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-alert"></div>
                <span>Safety Concern</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Traffic Issue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

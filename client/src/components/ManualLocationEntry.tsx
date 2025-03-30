import { useState } from "react";
import { Coordinates } from "@shared/types";

interface ManualLocationEntryProps {
  onLocationSubmit: (coordinates: Coordinates) => void;
  error: string | null;
}

export default function ManualLocationEntry({ onLocationSubmit, error }: ManualLocationEntryProps) {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [customError, setCustomError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      setCustomError("Please enter valid numbers for latitude and longitude.");
      return;
    }
    if (lat < -90 || lat > 90) {
      setCustomError("Latitude must be between -90 and 90 degrees.");
      return;
    }
    
    if (lng < -180 || lng > 180) {
      setCustomError("Longitude must be between -180 and 180 degrees.");
      return;
    }
    setCustomError(null);
    onLocationSubmit({ latitude: lat, longitude: lng });
  };

  const useExampleLocation = (city: string) => {
    switch(city) {
      case 'sanfrancisco':
        setLatitude("37.7749");
        setLongitude("-122.4194");
        break;
      case 'newyork':
        setLatitude("40.7128");
        setLongitude("-74.0060");
        break;
      case 'london':
        setLatitude("51.5074");
        setLongitude("-0.1278");
        break;
      case 'tokyo':
        setLatitude("35.6762");
        setLongitude("139.6503");
        break;
      case 'sydney':
        setLatitude("-33.8688");
        setLongitude("151.2093");
        break;
      default:
        setLatitude("37.7749");
        setLongitude("-122.4194");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
        <div className="flex items-center text-primary mb-4">
          <span className="material-icons text-4xl mr-2">location_on</span>
          <h1 className="text-xl font-semibold">Location Access Required</h1>
        </div>
        
        <p className="text-neutral-700 mb-4">
          This application needs location information to provide real-time risk data.
        </p>
        
        {error && (
          <div className="bg-danger/10 p-3 rounded-lg mb-4">
            <p className="text-danger text-sm">
              <span className="material-icons text-sm align-middle mr-1">error</span>
              Error: {error}
            </p>
          </div>
        )}
        
        {customError && (
          <div className="bg-danger/10 p-3 rounded-lg mb-4">
            <p className="text-danger text-sm">
              <span className="material-icons text-sm align-middle mr-1">error</span>
              {customError}
            </p>
          </div>
        )}
        
        <div className="mb-4">
          <button 
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
            onClick={() => window.location.reload()}
          >
            <span className="material-icons text-base">my_location</span>
            <span>Use My Device Location</span>
          </button>
          <p className="text-xs text-center mt-2 text-neutral-500">
            We prioritize using your device's live location for the most accurate information
          </p>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Or enter location manually</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Latitude
            </label>
            <input 
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 37.7749"
              className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Longitude
            </label>
            <input 
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. -122.4194"
              className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Quick Location Selection
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button 
                type="button"
                onClick={() => useExampleLocation('sanfrancisco')}
                className="py-1 px-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors text-xs"
              >
                San Francisco
              </button>
              <button 
                type="button"
                onClick={() => useExampleLocation('newyork')}
                className="py-1 px-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors text-xs"
              >
                New York
              </button>
              <button 
                type="button"
                onClick={() => useExampleLocation('london')}
                className="py-1 px-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors text-xs"
              >
                London
              </button>
              <button 
                type="button"
                onClick={() => useExampleLocation('tokyo')}
                className="py-1 px-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors text-xs"
              >
                Tokyo
              </button>
              <button 
                type="button"
                onClick={() => useExampleLocation('sydney')}
                className="py-1 px-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors text-xs"
              >
                Sydney
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Use This Manual Location
          </button>
        </form>
      </div>
    </div>
  );
}
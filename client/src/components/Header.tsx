import { useState, useEffect } from "react";
import { LocationInfo } from "@shared/types";

interface HeaderProps {
  locationInfo: LocationInfo | null;
  isLoading: boolean;
  onRefresh: () => void;
  isManualLocation?: boolean;
}

export default function Header({ locationInfo, isLoading, onRefresh, isManualLocation = false }: HeaderProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      };
      setDate(now.toLocaleDateString('en-US', dateOptions));
      
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      };
      setTime(now.toLocaleTimeString('en-US', timeOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Community Risk Monitor</h1>
          <div className="flex items-center text-sm text-neutral-600">
            <span className={`material-icons ${isManualLocation ? 'text-amber-500' : 'text-blue-600'} text-base mr-1`}>
              {isManualLocation ? "edit_location" : "my_location"}
            </span>
            <span>
              {isLoading ? "Loading location..." : locationInfo?.name || "Location unavailable"}
              {isManualLocation ? 
                (!isLoading && <span className="ml-1 text-xs italic text-amber-600">(Manual)</span>) : 
                (!isLoading && <span className="ml-1 text-xs font-medium text-blue-600">(Device Location)</span>)
              }
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="text-sm text-neutral-600">{date}</div>
            <div className="text-sm font-medium text-neutral-700">{time}</div>
          </div>
          <div className="flex space-x-2">
            {!isManualLocation && (
              <button 
                className="h-10 px-3 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-sm"
                onClick={() => window.dispatchEvent(new CustomEvent('open-manual-location'))}
                aria-label="Enter location manually"
              >
                <span className="material-icons text-neutral-700 text-sm mr-1">edit_location</span>
                <span className="hidden sm:inline">Manual Location</span>
              </button>
            )}
            <button 
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              onClick={onRefresh}
              aria-label="Refresh data"
            >
              <span className="material-icons text-neutral-700">refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

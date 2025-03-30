import { useState, useEffect } from "react";
import { Coordinates } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ManualLocationDialogProps {
  onLocationSubmit: (coordinates: Coordinates) => void;
}

export default function ManualLocationDialog({ onLocationSubmit }: ManualLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [latitude, setLatitude] = useState<string>("37.7749");
  const [longitude, setLongitude] = useState<string>("-122.4194");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenDialog = () => setOpen(true);
    window.addEventListener('open-manual-location', handleOpenDialog);
    
    return () => {
      window.removeEventListener('open-manual-location', handleOpenDialog);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError("Please enter valid numbers for latitude and longitude.");
      return;
    }
    
    if (lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90 degrees.");
      return;
    }
    
    if (lng < -180 || lng > 180) {
      setError("Longitude must be between -180 and 180 degrees.");
      return;
    }
    
    setError(null);
    
    onLocationSubmit({ latitude: lat, longitude: lng });
    setOpen(false);
  };

  const exampleLocations = [
    { name: " Hoboken, New Jersey", lat: 40.7440, lng: -74.0324 },
    { name: "New York", lat: 40.7128, lng: -74.0060 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 }
  ];

  const handleSelectExample = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manual Location Entry</DialogTitle>
          <DialogDescription>
            Enter specific coordinates to view risk information for that location.
            <span className="block mt-1 text-xs text-blue-600 italic">
              Note: Your device's live location provides the most accurate real-time information.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="bg-red-50 p-3 rounded-md border border-red-200">
              <p className="text-red-600 text-sm flex items-center">
                <span className="material-icons text-sm mr-1">error</span>
                {error}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 37.7749"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. -122.4194"
              />
            </div>
          </div>
          
          <div>
            <Label>Example locations</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {exampleLocations.map((location) => (
                <Button
                  key={location.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectExample(location.lat, location.lng)}
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-4">
            <Button 
              type="button" 
              variant="default" 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setOpen(false);
                window.location.reload(); 
              }}
            >
              <span className="material-icons text-sm">my_location</span>
              Use My Device Location Instead
            </Button>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Use These Coordinates</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
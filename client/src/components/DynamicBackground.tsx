import { useState, useEffect } from "react";
import { fetchBackgroundImage } from "@/lib/api";

interface DynamicBackgroundProps {
  latitude: number;
  longitude: number;
}

export default function DynamicBackground({ latitude, longitude }: DynamicBackgroundProps) {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.25);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        if (latitude && longitude) {
          const imageUrl = await fetchBackgroundImage(latitude, longitude);
          
          setOpacity(0);
          
          setTimeout(() => {
            setBackgroundUrl(imageUrl);
            setOpacity(0.25);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchBackground();
    
    const interval = setInterval(fetchBackground, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div 
        className="bg-image absolute inset-0 bg-cover bg-center transition-opacity duration-1500"
        style={{ 
          backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none',
          opacity
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/10 to-neutral-900/30" />
    </div>
  );
}

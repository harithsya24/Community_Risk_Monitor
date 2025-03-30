import { useQuery } from "@tanstack/react-query";
import { fetchDisasterAlertData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DisasterAlertCardProps {
  latitude: number;
  longitude: number;
  isLoading?: boolean;
}

export function DisasterAlertCard({ latitude, longitude, isLoading = false }: DisasterAlertCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { data, error, status } = useQuery({
    queryKey: ["disasterAlerts", latitude, longitude],
    queryFn: () => fetchDisasterAlertData(latitude, longitude),
    enabled: !isLoading && Boolean(latitude) && Boolean(longitude),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const getAlertIcon = (alertStatus: string | undefined) => {
    switch (alertStatus) {
      case "Warning":
        return <ShieldAlert className="h-6 w-6 text-red-500" />;
      case "Watch":
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case "Advisory":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-green-500" />;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "Warning":
        return "bg-red-100 text-red-800 border-red-300";
      case "Watch":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Advisory":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  if (status === "pending") {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Disaster Alerts
            </span>
            <Badge variant="outline" className="animate-pulse">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Disaster Alerts
            </span>
            <Badge variant="destructive">Error</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            Unable to load disaster alert data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span className="flex items-center gap-2">
            {getAlertIcon(data?.status)}
            Disaster Alerts
          </span>
          <Badge 
            variant="outline" 
            className={cn("font-semibold", getStatusColor(data?.status))}
          >
            {data?.statusText || "No Data"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {data?.alerts && data.alerts.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">{data.recommendations}</p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="w-full"
            >
              {expanded ? "Hide Alerts" : "View All Alerts"}
            </Button>

            {expanded && (
              <ScrollArea className="h-48">
                <Accordion type="single" collapsible className="w-full">
                  {data.alerts.map((alert, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-sm font-medium">
                        <span className="flex items-center gap-2">
                          {alert.title}
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "ml-2 text-xs", 
                              alert.type === "warning" ? "bg-red-100 text-red-800" : 
                              alert.type === "watch" ? "bg-orange-100 text-orange-800" : 
                              "bg-yellow-100 text-yellow-800"
                            )}
                          >
                            {alert.type}
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <p>{alert.description}</p>
                          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                            <span>Regions: {alert.regions}</span>
                            <span>Expires: {alert.expires}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            )}
          </div>
        ) : (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800 font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              All Clear
            </AlertTitle>
            <AlertDescription className="text-green-700 text-sm">
              {data?.recommendations || "No active weather alerts in your area. Continue with normal activities."}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {data?.lastUpdated || "Unknown"}
        </p>
      </CardContent>
    </Card>
  );
}
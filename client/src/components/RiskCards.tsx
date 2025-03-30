import { 
  WeatherData, 
  EnvironmentData, 
  SafetyData, 
  FireData, 
  NewsData,
  TrafficData 
} from "@shared/types";

interface WeatherData extends WeatherData { 
  itemsToCarry?: string[];
  thunderstorms?: boolean;
}

interface WeatherCardProps {
  data: WeatherData | null;
  isLoading: boolean;
}

export function WeatherCard({ data, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return <LoadingCard title="Weather & Outfit" icon="wb_sunny" iconClass="text-primary-dark" />;
  }

  if (!data) {
    return <ErrorCard title="Weather & Outfit" message="Unable to load weather data" />;
  }

  return (
    <div className="card-on-map rounded-xl overflow-hidden">
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="icon-container bg-primary-light/20">
          <span className="material-icons text-primary-dark">{data.icon || "wb_sunny"}</span>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-neutral-800">Weather & Outfit</h2>
          <p className="text-sm text-neutral-600">Current conditions & suggestions</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-3xl font-bold text-neutral-800">{data.temperature}°F</div>
            <div className="text-sm text-neutral-600">{data.conditions}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-800">{data.high}° / {data.low}°</div>
            <div className="text-xs text-neutral-600">Feels like {data.feelsLike}°</div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-neutral-700 mb-1">Today's Outfit Suggestion</h3>
          <p className="text-sm text-neutral-600">{data.outfitSuggestion}</p>
        </div>

        {data.itemsToCarry && data.itemsToCarry.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-neutral-700 mb-1">Items to Carry</h3>
              <ul className="text-sm text-neutral-600">
                {data.itemsToCarry.map((item, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="material-icons text-sm">chevron_right</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {data.thunderstorms && (
          <div className="mb-4">
            <p className="text-sm text-neutral-600">Warning: Thunderstorms possible. Exercise caution.</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="p-2 rounded bg-neutral-100">
            <div className="text-neutral-600 mb-1">Humidity</div>
            <div className="font-medium text-neutral-800">{data.humidity}%</div>
          </div>
          <div className="p-2 rounded bg-neutral-100">
            <div className="text-neutral-600 mb-1">Wind</div>
            <div className="font-medium text-neutral-800">{data.wind} mph</div>
          </div>
          <div className="p-2 rounded bg-neutral-100">
            <div className="text-neutral-600 mb-1">UV Index</div>
            <div className="font-medium text-neutral-800">{data.uvIndex}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EnvironmentCardProps {
  data: EnvironmentData | null;
  isLoading: boolean;
}

export function EnvironmentCard({ data, isLoading }: EnvironmentCardProps) {
  if (isLoading) {
    return <LoadingCard title="Environmental" icon="eco" iconClass="text-success" />;
  }

  if (!data) {
    return <ErrorCard title="Environmental" message="Unable to load environmental data" />;
  }

  return (
    <div className="card-on-map rounded-xl overflow-hidden">
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="icon-container bg-success-light/20">
          <span className="material-icons text-success">eco</span>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-neutral-800">Environmental</h2>
          <p className="text-sm text-neutral-600">Air quality & pollution</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl font-bold text-success">{data.airQualityText}</div>
            <div className="text-sm text-neutral-600">Air Quality Index</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-success flex items-center justify-center">
            <span className="text-xl font-bold text-neutral-800">{data.airQualityIndex}</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-neutral-700 mb-1">Recommendations</h3>
          <p className="text-sm text-neutral-600">{data.recommendation}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-neutral-100">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-600">PM2.5</span>
              <span className="font-medium text-neutral-800">{data.pm25}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: `${data.pm25Percentage}%` }}></div>
            </div>
          </div>
          <div className="p-2 rounded bg-neutral-100">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-600">Ozone</span>
              <span className="font-medium text-neutral-800">{data.ozone}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: `${data.ozonePercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SafetyCardProps {
  data: SafetyData | null;
  isLoading: boolean;
}

export function SafetyCard({ data, isLoading }: SafetyCardProps) {
  if (isLoading) {
    return <LoadingCard title="Area Safety" icon="security" iconClass="text-alert" />;
  }

  if (!data) {
    return <ErrorCard title="Area Safety" message="Unable to load safety data" />;
  }
  const safetyIndicators = () => {
    const indicators = [];

    if (data.level === "Low") {
      indicators.push(<div key="1" className="w-2 h-8 rounded-full bg-success"></div>);
      indicators.push(<div key="2" className="w-2 h-8 rounded-full bg-neutral-300"></div>);
      indicators.push(<div key="3" className="w-2 h-8 rounded-full bg-neutral-300"></div>);
    } else if (data.level === "Moderate") {
      indicators.push(<div key="1" className="w-2 h-8 rounded-full bg-success"></div>);
      indicators.push(<div key="2" className="w-2 h-8 rounded-full bg-alert"></div>);
      indicators.push(<div key="3" className="w-2 h-8 rounded-full bg-neutral-300"></div>);
    } else if (data.level === "High") {
      indicators.push(<div key="1" className="w-2 h-8 rounded-full bg-success"></div>);
      indicators.push(<div key="2" className="w-2 h-8 rounded-full bg-alert"></div>);
      indicators.push(<div key="3" className="w-2 h-8 rounded-full bg-danger"></div>);
    }

    return indicators;
  };

  const textColorClass = 
    data.level === "Low" ? "text-success" : 
    data.level === "Moderate" ? "text-alert" :
    "text-danger";

  return (
    <div className="card-on-map rounded-xl overflow-hidden">
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="icon-container bg-alert-light/20">
          <span className="material-icons text-alert">security</span>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-neutral-800">Area Safety</h2>
          <p className="text-sm text-neutral-600">Local crime & safety</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`text-xl font-bold ${textColorClass}`}>{data.levelText}</div>
            <div className="text-sm text-neutral-600">Safety Level</div>
          </div>
          <div className="flex">
            <div className="flex gap-1">
              {safetyIndicators()}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-neutral-700 mb-1">Safety Tips</h3>
          <p className="text-sm text-neutral-600">{data.tips}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-neutral-100">
            <div className="text-neutral-600 mb-1">Recent Incidents</div>
            <div className="font-medium text-neutral-800">{data.recentIncidents}</div>
          </div>
          <div className="p-2 rounded bg-neutral-100">
            <div className="text-neutral-600 mb-1">Most Common</div>
            <div className="font-medium text-neutral-800">{data.mostCommon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FireCardProps {
  data: FireData | null;
  isLoading: boolean;
}

export function FireCard({ data, isLoading }: FireCardProps) {
  if (isLoading) {
    return <LoadingCard title="Fire Incidents" icon="local_fire_department" iconClass="text-danger" />;
  }

  if (!data) {
    return <ErrorCard title="Fire Incidents" message="Unable to load fire data" />;
  }

  const statusIconClass = 
    data.status === "No Incidents" ? "text-success" : 
    data.status === "Caution" ? "text-alert" :
    "text-danger";

  const statusBgClass = 
    data.status === "No Incidents" ? "bg-success/20" : 
    data.status === "Caution" ? "bg-alert/20" :
    "bg-danger/20";

  const statusIcon = 
    data.status === "No Incidents" ? "check_circle" : 
    data.status === "Caution" ? "warning" :
    "error";

  const riskBarColor = 
    data.riskPercentage <= 33 ? "bg-success" : 
    data.riskPercentage <= 66 ? "bg-alert" :
    "bg-danger";

  const riskTextColor = 
    data.riskPercentage <= 33 ? "text-success" : 
    data.riskPercentage <= 66 ? "text-alert" :
    "text-danger";

  return (
    <div className="card-on-map rounded-xl overflow-hidden">
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="icon-container bg-danger-light/20">
          <span className="material-icons text-danger">local_fire_department</span>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-neutral-800">Fire Incidents</h2>
          <p className="text-sm text-neutral-600">Fire alerts in your area</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`text-xl font-bold ${statusIconClass}`}>{data.statusText}</div>
            <div className="text-sm text-neutral-600">Current Status</div>
          </div>
          <div className={`w-12 h-12 rounded-full ${statusBgClass} flex items-center justify-center`}>
            <span className={`material-icons ${statusIconClass}`}>{statusIcon}</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-neutral-700 mb-1">Fire Risk Today</h3>
          <div className="flex items-center gap-2">
            <div className="w-full bg-neutral-200 rounded-full h-2.5">
              <div className={`${riskBarColor} h-2.5 rounded-full`} style={{ width: `${data.riskPercentage}%` }}></div>
            </div>
            <span className={`text-xs font-medium ${riskTextColor}`}>{data.riskLevel}</span>
          </div>
        </div>

        <div className="p-2 rounded bg-neutral-100 text-xs">
          <div className="text-neutral-600 mb-1">Nearest Fire Station</div>
          <div className="font-medium text-neutral-800">{data.nearestStation}</div>
        </div>
      </div>
    </div>
  );
}

interface NewsCardProps {
  data: NewsData | null;
  isLoading: boolean;
}

export function NewsCard({ data, isLoading }: NewsCardProps) {
  if (isLoading) {
    return <LoadingCard title="Local News" icon="feed" iconClass="text-primary" />;
  }

  if (!data) {
    return <ErrorCard title="Local News" message="Unable to load news data" />;
  }

  return (
    <div className="card-on-map rounded-xl overflow-hidden">
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="icon-container bg-primary-light/20">
          <span className="material-icons text-primary">feed</span>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-neutral-800">Local News</h2>
          <p className="text-sm text-neutral-600">Recent updates in your area</p>
        </div>
      </div>
      <div className="p-4">
        {data.items.length === 0 ? (
          <div className="text-center py-4 text-neutral-600">No local news available at this time</div>
        ) : (
          data.items.map((item, index) => (
            <div key={index} className="mb-3 pb-3 border-b border-neutral-200 last:border-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-medium text-neutral-800">{item.title}</h3>
                <span className="text-xs text-neutral-500 whitespace-nowrap ml-2">{item.time}</span>
              </div>
              <p className="text-xs text-neutral-600 mb-1">{item.description}</p>
              <div className="flex items-center text-xs text-primary-dark">
                <span className="material-icons text-xs mr-1">place</span>
                <span>{item.location}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface TrafficCardProps {
  data: TrafficData | null;
  isLoading: boolean;
}

export function TrafficCard({ data, isLoading }: TrafficCardProps) {
  if (isLoading) {
    return <LoadingCard title="Traffic" icon="directions_car" iconClass="text-alert" />;
  }

  if (!data) {
    return <ErrorCard title="Traffic" message="Unable to load traffic data" />;
  }

  const statusTextColor = 
    data.statusText === "Light" ? "text-success" : 
    data.statusText === "Moderate" ? "text-alert" :
    "text-danger";

  return (
    <div className="card-on-map rounded-xl overflow-hidden">
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="icon-container bg-alert-light/20">
          <span className="material-icons text-alert">directions_car</span>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-neutral-800">Traffic</h2>
          <p className="text-sm text-neutral-600">Road conditions nearby</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`text-xl font-bold ${statusTextColor}`}>{data.statusText}</div>
            <div className="text-sm text-neutral-600">Traffic Conditions</div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-neutral-700">Travel Time</span>
            <span className="text-neutral-800 font-medium">{data.commuteTime}</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-neutral-600">
          <span className="material-icons text-primary align-bottom mr-1">ev_station</span>
          {data.evCharging}
        </div>

        {data.incident ? (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-neutral-700 mb-1">Incidents</h3>
            <div className="flex items-center p-2 bg-alert/10 rounded text-xs text-neutral-800">
              <span className="material-icons text-alert text-sm mr-2">warning</span>
              <span>{data.incident}</span>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-neutral-700 mb-1">Incidents</h3>
            <div className="flex items-center p-2 bg-success/10 rounded text-xs text-neutral-800">
              <span className="material-icons text-success text-sm mr-2">check_circle</span>
              <span>No incidents reported in your area</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          
          <div className="p-2 rounded bg-neutral-100">
            <div className="text-neutral-600 mb-1">Best Travel Time</div>
            <div className="font-medium text-neutral-800">{data.bestTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingCard({ title, icon, iconClass }: { title: string, icon: string, iconClass: string }) {
  return (
    <div className="card-on-map rounded-xl overflow-hidden">
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="icon-container bg-neutral-200">
          <span className={`material-icons ${iconClass}`}>{icon}</span>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
          <p className="text-sm text-neutral-600">Loading data...</p>
        </div>
      </div>
      <div className="p-4 flex justify-center items-center h-40">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-neutral-200 mb-4"></div>
          <div className="w-32 h-4 bg-neutral-200 rounded mb-2"></div>
          <div className="w-48 h-3 bg-neutral-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ title, message }: { title: string, message: string }) {
  return (
    <div className="card-on-map rounded-xl overflow-hidden">
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="icon-container bg-danger-light/20">
          <span className="material-icons text-danger">error</span>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
          <p className="text-sm text-neutral-600">Error loading data</p>
        </div>
      </div>
      <div className="p-4 flex justify-center items-center h-40">
        <div className="text-center">
          <div className="material-icons text-danger text-4xl mb-2">warning</div>
          <p className="text-neutral-600">{message}</p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark">
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
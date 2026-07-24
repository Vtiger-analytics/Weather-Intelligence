import React, { useState, useEffect, useCallback } from 'react';
import { 
  GeoLocation, 
  FullWeatherData, 
  AIBriefingResponse, 
  WeatherUnitsConfig, 
  FavoriteLocation 
} from './types';
import { 
  POPULAR_CITIES, 
  fetchFullWeatherData, 
  fetchAIBriefing, 
  reverseGeocode 
} from './services/weatherApi';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecastSection } from './components/HourlyForecastSection';
import { DailyForecastSection } from './components/DailyForecastSection';
import { PlanningRecommendationsSection } from './components/PlanningRecommendationsSection';
import { AirQualityCard } from './components/AirQualityCard';
import { AIBriefingCard } from './components/AIBriefingCard';
import { FavoriteLocationsDrawer } from './components/FavoriteLocationsDrawer';
import { Loader2, AlertCircle, Compass, Sparkles, RefreshCw } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'weather_intelligence_favorites_v1';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation>(POPULAR_CITIES[0]);
  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [aiBriefing, setAiBriefing] = useState<AIBriefingResponse | null>(null);
  
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [units, setUnits] = useState<WeatherUnitsConfig>({
    temp: 'celsius',
    wind: 'kmh',
    precip: 'mm'
  });

  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Load saved favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load favorites from localStorage:", e);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavs: FavoriteLocation[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavs));
    } catch (e) {
      console.warn("Failed to save favorites:", e);
    }
  };

  // Main data loader function
  const loadWeatherData = useCallback(async (location: GeoLocation, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingWeather(true);
    }
    setWeatherError(null);

    try {
      const data = await fetchFullWeatherData(location);
      setWeatherData(data);
      setIsLoadingWeather(false);
      setIsRefreshing(false);

      // Trigger AI briefing fetch
      setIsLoadingBriefing(true);
      const briefing = await fetchAIBriefing(data);
      setAiBriefing(briefing);
      setIsLoadingBriefing(false);
    } catch (err: any) {
      console.error("Error loading weather data:", err);
      setWeatherError(err.message || "Failed to load weather data for selected location.");
      setIsLoadingWeather(false);
      setIsRefreshing(false);
      setIsLoadingBriefing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeatherData(selectedLocation);
  }, [selectedLocation, loadWeatherData]);

  // Handle Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const geoLoc = await reverseGeocode(latitude, longitude);
        setSelectedLocation(geoLoc);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        alert("Unable to retrieve your current location. Please check browser permissions.");
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle favorite
  const isCurrentFavorite = favorites.some((f) => f.id === selectedLocation.id);

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      const updated = favorites.filter((f) => f.id !== selectedLocation.id);
      saveFavorites(updated);
    } else {
      const newFav: FavoriteLocation = {
        id: selectedLocation.id,
        name: selectedLocation.name,
        country: selectedLocation.country,
        admin1: selectedLocation.admin1,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timezone: selectedLocation.timezone,
        addedAt: new Date().toISOString()
      };
      saveFavorites([...favorites, newFav]);
    }
  };

  const handleToggleTempUnit = () => {
    setUnits((prev) => ({
      ...prev,
      temp: prev.temp === 'celsius' ? 'fahrenheit' : 'celsius'
    }));
  };

  const handleToggleWindUnit = () => {
    setUnits((prev) => ({
      ...prev,
      wind: prev.wind === 'kmh' ? 'mph' : prev.wind === 'mph' ? 'ms' : 'kmh'
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Header
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        onUseCurrentLocation={handleUseCurrentLocation}
        units={units}
        onToggleTempUnit={handleToggleTempUnit}
        onToggleWindUnit={handleToggleWindUnit}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        currentLocationName={selectedLocation.name}
        isLocating={isLocating}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Error State Banner */}
        {weatherError && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{weatherError}</span>
            </div>
            <button
              onClick={() => loadWeatherData(selectedLocation, true)}
              className="px-3 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-slate-100 font-semibold transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Spinner Screen */}
        {isLoadingWeather && !weatherData ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                <Compass className="w-8 h-8 text-sky-400 animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-200">Fetching Weather Telemetry</p>
              <p className="text-xs text-slate-500 mt-1">Retrieving Open-Meteo satellite & station forecasts for {selectedLocation.name}...</p>
            </div>
          </div>
        ) : weatherData ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* 1. Hero Current Weather Card */}
            <CurrentWeatherCard
              data={weatherData}
              units={units}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              onRefresh={() => loadWeatherData(selectedLocation, true)}
              isRefreshing={isRefreshing}
            />

            {/* 2. AI Weather Intelligence Briefing Card */}
            <AIBriefingCard
              briefing={aiBriefing}
              isLoadingBriefing={isLoadingBriefing}
              onRefreshBriefing={async () => {
                setIsLoadingBriefing(true);
                const b = await fetchAIBriefing(weatherData);
                setAiBriefing(b);
                setIsLoadingBriefing(false);
              }}
              weatherData={weatherData}
            />

            {/* 3. Planning & Activity Recommendations Engine */}
            <PlanningRecommendationsSection data={weatherData} />

            {/* 4. 24-Hour Hourly Forecast Section */}
            <HourlyForecastSection data={weatherData} units={units} />

            {/* 5. 7-Day Extended Forecast Section */}
            <DailyForecastSection data={weatherData} units={units} />

            {/* 6. Air Quality Telemetry Card */}
            <AirQualityCard airQuality={weatherData.airQuality} />

          </div>
        ) : null}

      </main>

      {/* Saved Locations Drawer */}
      <FavoriteLocationsDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectFavorite={(fav) => {
          setSelectedLocation({
            id: fav.id,
            name: fav.name,
            country: fav.country,
            admin1: fav.admin1,
            latitude: fav.latitude,
            longitude: fav.longitude,
            timezone: fav.timezone
          });
        }}
        onRemoveFavorite={(id) => {
          const updated = favorites.filter((f) => f.id !== id);
          saveFavorites(updated);
        }}
      />

      {/* Application Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 lg:px-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-400">Weather Intelligence Engine</span>
          </div>
          <div>
            Powered by Open-Meteo Weather APIs & Google Gemini 3.6 Flash
          </div>
        </div>
      </footer>

    </div>
  );
}

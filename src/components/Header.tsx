import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Bookmark, Sparkles, X, Loader2, Compass } from 'lucide-react';
import { GeoLocation, WeatherUnitsConfig } from '../types';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';

interface HeaderProps {
  onSelectLocation: (loc: GeoLocation) => void;
  onUseCurrentLocation: () => void;
  units: WeatherUnitsConfig;
  onToggleTempUnit: () => void;
  onToggleWindUnit: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  currentLocationName?: string;
  isLocating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectLocation,
  onUseCurrentLocation,
  units,
  onToggleTempUnit,
  onToggleWindUnit,
  favoritesCount,
  onOpenFavorites,
  currentLocationName,
  isLocating = false
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        const cities = await searchCities(query);
        setResults(cities);
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 280);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        
        {/* Brand & Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-sky-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-100 font-sans">
                  Weather Intelligence
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Sparkles className="w-3 h-3 text-sky-400" /> AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentLocationName ? `Viewing: ${currentLocationName}` : 'Precision weather forecasts & planning'}
              </p>
            </div>
          </div>

          {/* Mobile Favorites & Unit Switcher */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleTempUnit}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
              title="Toggle Temperature Unit"
            >
              °{units.temp === 'celsius' ? 'C' : 'F'}
            </button>
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Saved Locations"
            >
              <Bookmark className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar & Auto-Complete */}
        <div ref={searchRef} className="relative w-full md:max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.trim().length >= 2 || results.length > 0) setIsOpen(true);
              }}
              placeholder="Search city, state, or country..."
              className="w-full pl-10 pr-24 py-2 text-sm bg-slate-800/90 text-slate-100 placeholder-slate-400 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-inner"
              id="city-search-input"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setIsOpen(false); }}
                className="absolute right-12 p-1 text-slate-400 hover:text-slate-200 transition"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="absolute right-1.5 p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition flex items-center justify-center disabled:opacity-50"
              title="Use My Location"
              id="btn-use-location"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  Searching global location database...
                </div>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <button
                    key={`${item.id}-${item.latitude}-${item.longitude}`}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-800/80 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-sm font-medium text-slate-200 group-hover:text-sky-300 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                    {item.elevation && (
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/50">
                        {Math.round(item.elevation)}m alt
                      </span>
                    )}
                  </button>
                ))
              ) : query.trim().length >= 2 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No cities found matching "{query}".
                </div>
              ) : null}

              {/* Popular quick picks section when search is short */}
              {query.trim().length < 2 && (
                <div className="p-3 bg-slate-950/50">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
                    Popular Destinations
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {POPULAR_CITIES.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleSelect(city)}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 hover:text-sky-300 transition flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        <span className="truncate">{city.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Controls (Units & Favorites) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Temp Unit Toggle */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/80">
            <button
              onClick={onToggleTempUnit}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                units.temp === 'celsius'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={onToggleTempUnit}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                units.temp === 'fahrenheit'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Wind Unit Toggle */}
          <button
            onClick={onToggleWindUnit}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Switch Wind Speed Unit"
          >
            Wind: <span className="text-sky-400 font-semibold">{units.wind.toUpperCase()}</span>
          </button>

          {/* Favorites Drawer Trigger */}
          <button
            onClick={onOpenFavorites}
            className="relative px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2"
            id="btn-open-favorites"
          >
            <Bookmark className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-medium">Saved Cities</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-sky-500 text-slate-950">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

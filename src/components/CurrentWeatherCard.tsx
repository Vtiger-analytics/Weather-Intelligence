import React from 'react';
import { 
  Wind, 
  Droplets, 
  Sun, 
  Gauge, 
  Eye, 
  Cloud, 
  Thermometer, 
  Sunrise, 
  Sunset, 
  Compass, 
  Bookmark, 
  BookmarkCheck,
  RefreshCw,
  Navigation
} from 'lucide-react';
import { FullWeatherData, WeatherUnitsConfig } from '../types';
import { 
  getWeatherCodeDetail, 
  formatTemp, 
  formatWindSpeed, 
  getWindDirectionLabel, 
  getUVCategory, 
  calculateSunPosition,
  formatTimeString 
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  data: FullWeatherData;
  units: WeatherUnitsConfig;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  units,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  isRefreshing = false
}) => {
  const { current, location, daily, fetchedAt } = data;
  const weatherDetail = getWeatherCodeDetail(current.weather_code);
  const isNight = current.is_day === 0;

  const tempMaxC = daily.temperature_2m_max[0];
  const tempMinC = daily.temperature_2m_min[0];

  const sunriseIso = daily.sunrise[0];
  const sunsetIso = daily.sunset[0];
  const nowIso = current.time;

  const sunProgress = calculateSunPosition(sunriseIso, sunsetIso, nowIso);
  const sunriseTimeStr = formatTimeString(sunriseIso, location.timezone);
  const sunsetTimeStr = formatTimeString(sunsetIso, location.timezone);

  const uvMax = daily.uv_index_max[0] || 0;
  const uvCategory = getUVCategory(uvMax);

  const windDeg = current.wind_direction_10m;
  const windDirLabel = getWindDirectionLabel(windDeg);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br ${weatherDetail.gradient} bg-slate-900/90 p-6 lg:p-8 shadow-2xl backdrop-blur-xl transition-all`}>
      
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
              {location.name}
            </h2>
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-xl transition-all border ${
                isFavorite
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              id="btn-toggle-favorite"
            >
              {isFavorite ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>{[location.admin1, location.country].filter(Boolean).join(', ')}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>Timezone: {location.timezone}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${weatherDetail.badgeBg}`}>
            <WeatherIcon code={current.weather_code} isDay={current.is_day} size={16} />
            {weatherDetail.label}
          </span>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 text-xs"
            title="Refresh weather data"
            id="btn-refresh-weather"
          >
            <RefreshCw className={`w-4 h-4 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Temp & Condition Showcase */}
      <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Main Temperature Gauge */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 backdrop-blur-md shadow-inner">
            <WeatherIcon code={current.weather_code} isDay={current.is_day} size={72} className="w-20 h-20" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl lg:text-7xl font-black text-slate-50 tracking-tighter font-sans">
                {formatTemp(current.temperature_2m, units.temp)}
              </span>
              <div className="text-sm font-medium text-slate-400 space-y-0.5">
                <div>Feels like <span className="font-bold text-slate-200">{formatTemp(current.apparent_temperature, units.temp)}</span></div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-rose-400 font-medium">H: {formatTemp(tempMaxC, units.temp)}</span>
                  <span className="text-sky-400 font-medium">L: {formatTemp(tempMinC, units.temp)}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-md">
              {weatherDetail.description}
            </p>
          </div>
        </div>

        {/* Sunrise / Sunset Solar Position Arc */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Sun className="w-4 h-4" /> Solar Cycle
            </span>
            <span>{isNight ? 'Night Time' : 'Daylight Hours'}</span>
          </div>

          {/* Solar Arc Bar */}
          <div className="relative my-2">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-indigo-500 rounded-full transition-all duration-1000" 
                style={{ width: `${sunProgress}%` }}
              />
            </div>
            {/* Solar Marker Pin */}
            <div 
              className="absolute -top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 shadow-md transform -translate-x-1/2 transition-all duration-1000"
              style={{ left: `${sunProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-300 mt-3 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400">Sunrise</div>
                <div className="font-semibold">{sunriseTimeStr}</div>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              {isNight ? 'Sun sets tomorrow' : `${100 - sunProgress}% daylight left`}
            </div>

            <div className="flex items-center gap-1.5 text-right">
              <div>
                <div className="text-[10px] text-slate-400">Sunset</div>
                <div className="font-semibold">{sunsetTimeStr}</div>
              </div>
              <Sunset className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </div>

      </div>

      {/* Grid Metrics Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-6 border-t border-slate-800/80">
        
        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Humidity</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-100">
              {current.relative_humidity_2m}%
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-sky-400 rounded-full" 
                style={{ width: `${current.relative_humidity_2m}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Wind Speed</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-100 flex items-center gap-1.5">
              <span>{formatWindSpeed(current.wind_speed_10m, units.wind)}</span>
              <Navigation 
                className="w-3.5 h-3.5 text-teal-400" 
                style={{ transform: `rotate(${windDeg}deg)` }} 
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {windDirLabel} ({windDeg}°) • Gusts {formatWindSpeed(current.wind_gusts_10m, units.wind)}
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>{uvMax.toFixed(1)}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${uvCategory.textColor} bg-slate-800`}>
                {uvCategory.level}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full ${uvCategory.color} rounded-full`} 
                style={{ width: `${Math.min(100, (uvMax / 11) * 100)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Pressure */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-100">
              {Math.round(current.pressure_msl)} <span className="text-xs font-normal text-slate-400">hPa</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {current.pressure_msl > 1013 ? 'High pressure (Stable)' : 'Low pressure (Unstable)'}
            </div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cloud Cover</span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-100">
              {current.cloud_cover}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {current.cloud_cover < 20 ? 'Clear skies' : current.cloud_cover < 70 ? 'Partly cloudy' : 'Overcast'}
            </div>
          </div>
        </div>

        {/* Dew Point */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dew Point</span>
            <Thermometer className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-100">
              {formatTemp(data.hourly.dew_point_2m[0] || current.temperature_2m - 5, units.temp)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Moisture saturation point
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

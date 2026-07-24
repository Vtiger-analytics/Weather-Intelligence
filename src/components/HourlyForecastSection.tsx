import React, { useState } from 'react';
import { Clock, Thermometer, CloudRain, Wind, Sun, BarChart2 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Bar, 
  ComposedChart,
  Line
} from 'recharts';
import { FullWeatherData, WeatherUnitsConfig } from '../types';
import { 
  formatTempVal, 
  formatWindSpeed, 
  formatTimeString 
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastSectionProps {
  data: FullWeatherData;
  units: WeatherUnitsConfig;
}

type ChartTab = 'temperature' | 'precipitation' | 'wind' | 'uv_cloud';

export const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({ data, units }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('temperature');

  const { hourly, location } = data;
  if (!hourly || !hourly.time) return null;

  // Prepare 24-hour data slice
  const hourlyItems = hourly.time.slice(0, 24).map((timeIso, idx) => {
    const tempC = hourly.temperature_2m[idx];
    const apparentC = hourly.apparent_temperature[idx];
    const precipProb = hourly.precipitation_probability[idx] || 0;
    const precipVal = hourly.precipitation[idx] || 0;
    const windKmh = hourly.wind_speed_10m[idx] || 0;
    const uv = hourly.uv_index[idx] || 0;
    const cloud = hourly.cloud_cover[idx] || 0;
    const code = hourly.weather_code[idx] || 0;

    const timeLabel = formatTimeString(timeIso, location.timezone);

    return {
      timeIso,
      timeLabel,
      temp: formatTempVal(tempC, units.temp),
      apparentTemp: formatTempVal(apparentC, units.temp),
      precipProb,
      precipVal,
      windSpeed: Math.round(windKmh),
      uv,
      cloud,
      code
    };
  });

  return (
    <div className="p-6 lg:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-6">
      
      {/* Header & Chart Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">24-Hour Hourly Forecast</h3>
            <p className="text-xs text-slate-400">Detailed hourly weather evolution & interactive visual trends</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('temperature')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'temperature'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" /> Temp
          </button>
          <button
            onClick={() => setActiveTab('precipitation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'precipitation'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain %
          </button>
          <button
            onClick={() => setActiveTab('wind')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'wind'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Wind
          </button>
          <button
            onClick={() => setActiveTab('uv_cloud')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'uv_cloud'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> UV & Cloud
          </button>
        </div>
      </div>

      {/* Recharts Interactive Graph */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temperature' ? (
            <AreaChart data={hourlyItems} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit={`°`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                formatter={(val: any, name: any) => [
                  `${val}°${units.temp === 'celsius' ? 'C' : 'F'}`,
                  name === 'temp' ? 'Temperature' : 'Feels Like'
                ]}
              />
              <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
              <Area type="monotone" dataKey="apparentTemp" stroke="#818cf8" strokeWidth={2} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          ) : activeTab === 'precipitation' ? (
            <ComposedChart data={hourlyItems} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                formatter={(val: any, name: any) => [
                  name === 'precipProb' ? `${val}% chance` : `${val} mm`,
                  name === 'precipProb' ? 'Rain Prob' : 'Precipitation'
                ]}
              />
              <Bar dataKey="precipProb" fill="#38bdf8" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line type="monotone" dataKey="precipVal" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </ComposedChart>
          ) : activeTab === 'wind' ? (
            <AreaChart data={hourlyItems} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                formatter={(val: any) => [formatWindSpeed(val, units.wind), 'Wind Speed']}
              />
              <Area type="monotone" dataKey="windSpeed" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#windGradient)" />
            </AreaChart>
          ) : (
            <ComposedChart data={hourlyItems} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                formatter={(val: any, name: any) => [
                  name === 'uv' ? `UV ${val}` : `${val}% Cloud`,
                  name === 'uv' ? 'UV Index' : 'Cloud Cover'
                ]}
              />
              <Bar dataKey="cloud" fill="#64748b" radius={[4, 4, 0, 0]} opacity={0.4} />
              <Line type="monotone" dataKey="uv" stroke="#fbbf24" strokeWidth={3} dot={{ fill: '#fbbf24' }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Scrollable Horizontal 24-Hour Cards */}
      <div className="pt-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Hourly Cards List
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
          {hourlyItems.map((item, idx) => (
            <div
              key={`${item.timeIso}-${idx}`}
              className={`flex-shrink-0 w-24 p-3 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'bg-sky-500/15 border-sky-500/40 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-xs font-medium text-slate-300">
                {idx === 0 ? 'Now' : item.timeLabel}
              </div>

              <div className="my-2 flex justify-center">
                <WeatherIcon code={item.code} size={28} className="w-7 h-7" />
              </div>

              <div className="text-base font-bold text-slate-100">
                {item.temp}°
              </div>

              {item.precipProb > 10 && (
                <div className="text-[10px] font-bold text-sky-400 mt-1 flex items-center justify-center gap-0.5">
                  <CloudRain className="w-2.5 h-2.5" />
                  {item.precipProb}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

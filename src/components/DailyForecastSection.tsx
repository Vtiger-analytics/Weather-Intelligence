import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, CloudRain, Sun, Wind, Sunrise, Sunset, Droplets } from 'lucide-react';
import { FullWeatherData, WeatherUnitsConfig } from '../types';
import { 
  getWeatherCodeDetail, 
  formatTemp, 
  formatTempVal, 
  formatDayString, 
  getUVCategory, 
  formatWindSpeed,
  formatTimeString 
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastSectionProps {
  data: FullWeatherData;
  units: WeatherUnitsConfig;
}

export const DailyForecastSection: React.FC<DailyForecastSectionProps> = ({ data, units }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0); // Default expand today

  const { daily, location } = data;
  if (!daily || !daily.time) return null;

  // Calculate overall 7-day min/max temperatures for relative visual range bar
  const allMaxsC = daily.temperature_2m_max;
  const allMinsC = daily.temperature_2m_min;
  const minTemp7DaysC = Math.min(...allMinsC);
  const maxTemp7DaysC = Math.max(...allMaxsC);
  const tempSpan = Math.max(1, maxTemp7DaysC - minTemp7DaysC);

  const toggleExpand = (idx: number) => {
    setExpandedDay(expandedDay === idx ? null : idx);
  };

  return (
    <div className="p-6 lg:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">7-Day Extended Forecast</h3>
            <p className="text-xs text-slate-400">7-day outlook with temperature spectrum & daily deep-dives</p>
          </div>
        </div>
      </div>

      {/* Daily Rows */}
      <div className="divide-y divide-slate-800/60">
        {daily.time.map((dateStr, idx) => {
          const code = daily.weather_code[idx];
          const weatherDetail = getWeatherCodeDetail(code);
          const maxTempC = daily.temperature_2m_max[idx];
          const minTempC = daily.temperature_2m_min[idx];
          const precipProb = daily.precipitation_probability_max[idx] || 0;
          const precipSum = daily.precipitation_sum[idx] || 0;
          const uvMax = daily.uv_index_max[idx] || 0;
          const uvCategory = getUVCategory(uvMax);
          const maxWindKmh = daily.wind_speed_10m_max[idx] || 0;

          const { dayName, shortDate } = formatDayString(dateStr);
          const isToday = idx === 0;
          const isExpanded = expandedDay === idx;

          // Calculate bar percentage offsets
          const leftPercent = ((minTempC - minTemp7DaysC) / tempSpan) * 100;
          const widthPercent = Math.max(8, ((maxTempC - minTempC) / tempSpan) * 100);

          return (
            <div key={dateStr} className="py-3 transition-all">
              
              {/* Row Bar */}
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-800/50 transition-colors group"
              >
                
                {/* Day & Date */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <WeatherIcon code={code} size={28} className="w-7 h-7 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{isToday ? 'Today' : dayName}</span>
                      {isToday && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          Now
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{shortDate}</div>
                  </div>
                </div>

                {/* Condition Label */}
                <div className="hidden md:flex items-center gap-2 min-w-[160px]">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${weatherDetail.badgeBg}`}>
                    {weatherDetail.label}
                  </span>
                </div>

                {/* Rain Chance */}
                <div className="flex items-center gap-1 min-w-[70px] text-xs font-semibold text-sky-400">
                  {precipProb > 10 ? (
                    <>
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>{precipProb}%</span>
                    </>
                  ) : (
                    <span className="text-slate-500 font-normal text-[11px]">0% rain</span>
                  )}
                </div>

                {/* Min-Max Temperature Spectrum Bar */}
                <div className="flex items-center gap-3 flex-1 max-w-xs w-full">
                  <span className="text-xs font-semibold text-sky-400 w-10 text-right">
                    {formatTemp(minTempC, units.temp)}
                  </span>

                  <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`
                      }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-rose-400 w-10">
                    {formatTemp(maxTempC, units.temp)}
                  </span>
                </div>

                {/* Expand Chevron */}
                <div className="text-slate-400 group-hover:text-slate-200 transition-colors ml-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>

              </button>

              {/* Expanded Day Details Panel */}
              {isExpanded && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {dayName} Detailed Metrics & Solar Outlook
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> Max UV Index
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1">
                        {uvMax.toFixed(1)} <span className={`text-[10px] font-bold ${uvCategory.textColor}`}>({uvCategory.level})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{uvCategory.advice}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-sky-400" /> Precip Sum
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1">
                        {precipSum.toFixed(1)} mm
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {precipProb > 50 ? 'Wet conditions expected' : 'Minimal accumulation'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-teal-400" /> Max Wind
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1">
                        {formatWindSpeed(maxWindKmh, units.wind)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Peak wind speeds</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Sun Times
                      </div>
                      <div className="text-xs font-bold text-slate-100 mt-1">
                        🌅 {formatTimeString(daily.sunrise[idx], location.timezone)}
                      </div>
                      <div className="text-xs font-bold text-slate-100 mt-0.5">
                        🌇 {formatTimeString(daily.sunset[idx], location.timezone)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

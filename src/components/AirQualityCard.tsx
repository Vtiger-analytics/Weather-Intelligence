import React from 'react';
import { Wind, ShieldAlert, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { AirQualityData } from '../types';
import { getAQICategory } from '../utils/weatherUtils';

interface AirQualityCardProps {
  airQuality?: AirQualityData;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  if (!airQuality || !airQuality.us_aqi || airQuality.us_aqi.length === 0) {
    return (
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl text-center text-xs text-slate-400">
        Air quality data currently unavailable for this station location.
      </div>
    );
  }

  const usAqi = Math.round(airQuality.us_aqi[0] || 35);
  const eurAqi = Math.round(airQuality.european_aqi?.[0] || 20);
  const category = getAQICategory(usAqi);

  const pm25 = airQuality.pm2_5?.[0] ? airQuality.pm2_5[0].toFixed(1) : 'N/A';
  const pm10 = airQuality.pm10?.[0] ? airQuality.pm10[0].toFixed(1) : 'N/A';
  const o3 = airQuality.ozone?.[0] ? airQuality.ozone[0].toFixed(1) : 'N/A';
  const no2 = airQuality.nitrogen_dioxide?.[0] ? airQuality.nitrogen_dioxide[0].toFixed(1) : 'N/A';

  return (
    <div className="p-6 lg:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Air Quality & Pollution Monitor</h3>
            <p className="text-xs text-slate-400">Real-time environmental atmospheric particle telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${category.badgeClass}`}>
            US AQI: {usAqi} • {category.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mt-5">
        
        {/* US AQI Gauge & Health Summary */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">US Air Quality Index</span>
            <span className="text-xs text-slate-500">EU AQI: {eurAqi}</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-100 tracking-tight">{usAqi}</span>
            <span className="text-sm font-semibold text-slate-300">/ 500</span>
          </div>

          {/* AQI Color Scale Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full mt-3 overflow-hidden relative">
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.min(100, (usAqi / 300) * 100)}%`,
                backgroundColor: category.color
              }}
            />
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span>{category.healthDescription}</span>
          </p>
        </div>

        {/* Pollutant Metrics Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/60">
            <div className="text-[10px] text-slate-400 font-medium">PM 2.5</div>
            <div className="text-lg font-bold text-slate-200 mt-1">{pm25} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Fine particles</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/60">
            <div className="text-[10px] text-slate-400 font-medium">PM 10</div>
            <div className="text-lg font-bold text-slate-200 mt-1">{pm10} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Coarse particles</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/60">
            <div className="text-[10px] text-slate-400 font-medium">Ozone (O₃)</div>
            <div className="text-lg font-bold text-slate-200 mt-1">{o3} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Ground level</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/60">
            <div className="text-[10px] text-slate-400 font-medium">NO₂</div>
            <div className="text-lg font-bold text-slate-200 mt-1">{no2} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Nitrogen dioxide</div>
          </div>

        </div>

      </div>
    </div>
  );
};

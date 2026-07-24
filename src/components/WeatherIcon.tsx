import React from 'react';
import { 
  Sun, 
  SunDim, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudRainWind, 
  CloudSnow, 
  Snowflake, 
  CloudSunRain, 
  CloudLightning,
  Moon,
  CloudMoon
} from 'lucide-react';
import { WMO_WEATHER_CODES } from '../utils/weatherUtils';

interface WeatherIconProps {
  code: number;
  isDay?: number; // 1 = day, 0 = night
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  code, 
  isDay = 1, 
  className = "w-8 h-8 text-amber-500", 
  size 
}) => {
  const detail = WMO_WEATHER_CODES[code];
  const isNight = isDay === 0;

  if (isNight) {
    if (code === 0 || code === 1) {
      return <Moon size={size} className={`text-indigo-300 animate-pulse ${className}`} />;
    }
    if (code === 2) {
      return <CloudMoon size={size} className={`text-slate-300 ${className}`} />;
    }
  }

  const iconName = detail ? detail.icon : 'Cloud';

  switch (iconName) {
    case 'Sun':
      return <Sun size={size} className={`text-amber-500 hover:rotate-45 transition-transform duration-500 ${className}`} />;
    case 'SunDim':
      return <SunDim size={size} className={`text-amber-400 ${className}`} />;
    case 'CloudSun':
      return <CloudSun size={size} className={`text-sky-400 ${className}`} />;
    case 'Cloud':
      return <Cloud size={size} className={`text-slate-400 ${className}`} />;
    case 'CloudFog':
      return <CloudFog size={size} className={`text-slate-300 ${className}`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle size={size} className={`text-teal-400 ${className}`} />;
    case 'CloudRain':
      return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
    case 'CloudRainWind':
      return <CloudRainWind size={size} className={`text-blue-500 ${className}`} />;
    case 'CloudSnow':
      return <CloudSnow size={size} className={`text-cyan-300 ${className}`} />;
    case 'Snowflake':
      return <Snowflake size={size} className={`text-sky-200 animate-spin-slow ${className}`} />;
    case 'CloudSunRain':
      return <CloudSunRain size={size} className={`text-sky-400 ${className}`} />;
    case 'CloudLightning':
      return <CloudLightning size={size} className={`text-amber-400 animate-bounce ${className}`} />;
    default:
      return <Cloud size={size} className={`text-slate-400 ${className}`} />;
  }
};

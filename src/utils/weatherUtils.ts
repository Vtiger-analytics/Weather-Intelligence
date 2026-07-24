import { TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from '../types';

export interface WeatherCodeDetail {
  code: number;
  label: string;
  description: string;
  icon: string; // Lucide icon identifier
  category: 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'thunderstorm';
  gradient: string;
  badgeBg: string;
}

export const WMO_WEATHER_CODES: Record<number, WeatherCodeDetail> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Completely clear blue sky with full sunshine',
    icon: 'Sun',
    category: 'clear',
    gradient: 'from-amber-500/20 via-sky-500/10 to-blue-600/20',
    badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Mostly clear skies with a few drifting clouds',
    icon: 'SunDim',
    category: 'clear',
    gradient: 'from-sky-400/20 via-blue-500/10 to-indigo-600/20',
    badgeBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Scattered clouds with intermittent sunshine',
    icon: 'CloudSun',
    category: 'cloudy',
    gradient: 'from-blue-400/20 via-slate-500/10 to-slate-700/20',
    badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Dense gray cloud cover across the entire sky',
    icon: 'Cloud',
    category: 'cloudy',
    gradient: 'from-slate-500/20 via-slate-600/15 to-zinc-800/20',
    badgeBg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30'
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Reduced visibility due to atmospheric fog',
    icon: 'CloudFog',
    category: 'fog',
    gradient: 'from-zinc-500/20 via-slate-600/15 to-slate-800/20',
    badgeBg: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30'
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    description: 'Freezing fog forming icy frost coatings',
    icon: 'CloudFog',
    category: 'fog',
    gradient: 'from-cyan-600/20 via-slate-600/15 to-slate-800/20',
    badgeBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Very fine mist and light scattered drops',
    icon: 'CloudDrizzle',
    category: 'rain',
    gradient: 'from-teal-500/20 via-blue-600/15 to-slate-800/20',
    badgeBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30'
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady fine misting rain shower',
    icon: 'CloudDrizzle',
    category: 'rain',
    gradient: 'from-teal-600/20 via-blue-600/15 to-slate-800/20',
    badgeBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30'
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy fine rain soaking wet surfaces',
    icon: 'CloudRain',
    category: 'rain',
    gradient: 'from-blue-600/20 via-indigo-600/15 to-slate-800/20',
    badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
  },
  56: {
    code: 56,
    label: 'Light Freezing Drizzle',
    description: 'Chilly drizzle creating icy patches on roads',
    icon: 'CloudSnow',
    category: 'rain',
    gradient: 'from-cyan-500/20 via-blue-700/15 to-slate-900/20',
    badgeBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    description: 'Heavy freezing drizzle causing widespread ice formation',
    icon: 'CloudSnow',
    category: 'rain',
    gradient: 'from-cyan-600/20 via-blue-800/15 to-slate-900/20',
    badgeBg: 'bg-cyan-600/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30'
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Light rainfall with occasional gentle breaks',
    icon: 'CloudRain',
    category: 'rain',
    gradient: 'from-blue-500/20 via-sky-600/15 to-indigo-900/20',
    badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Continuous steady rain shower',
    icon: 'CloudRain',
    category: 'rain',
    gradient: 'from-blue-600/25 via-indigo-700/20 to-slate-900/25',
    badgeBg: 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Heavy torrential downpour with pooling water',
    icon: 'CloudRainWind',
    category: 'rain',
    gradient: 'from-blue-700/30 via-indigo-900/25 to-slate-950/30',
    badgeBg: 'bg-blue-700/20 text-blue-700 dark:text-blue-300 border-blue-600/30'
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Chilly rainfall freezing on impact',
    icon: 'CloudSnow',
    category: 'rain',
    gradient: 'from-cyan-600/25 via-blue-800/20 to-slate-900/25',
    badgeBg: 'bg-cyan-600/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/30'
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Dangerous freezing rain causing ice accretion',
    icon: 'CloudSnow',
    category: 'rain',
    gradient: 'from-cyan-700/30 via-blue-900/25 to-slate-950/30',
    badgeBg: 'bg-cyan-700/20 text-cyan-700 dark:text-cyan-200 border-cyan-600/30'
  },
  71: {
    code: 71,
    label: 'Slight Snow Fall',
    description: 'Gentle flurries and light snowfall accumulation',
    icon: 'Snowflake',
    category: 'snow',
    gradient: 'from-indigo-400/20 via-sky-300/15 to-slate-800/20',
    badgeBg: 'bg-sky-400/15 text-sky-700 dark:text-sky-300 border-sky-400/30'
  },
  73: {
    code: 73,
    label: 'Moderate Snow Fall',
    description: 'Steady snowfall building snowpack on ground',
    icon: 'Snowflake',
    category: 'snow',
    gradient: 'from-sky-500/20 via-indigo-600/15 to-slate-800/20',
    badgeBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-400/30'
  },
  75: {
    code: 75,
    label: 'Heavy Snow Fall',
    description: 'Dense heavy snow reduction in visibility',
    icon: 'Snowflake',
    category: 'snow',
    gradient: 'from-sky-600/25 via-blue-700/20 to-slate-900/25',
    badgeBg: 'bg-sky-600/20 text-sky-800 dark:text-sky-200 border-sky-500/30'
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Tiny ice particles falling from low clouds',
    icon: 'Snowflake',
    category: 'snow',
    gradient: 'from-blue-400/20 via-slate-600/15 to-slate-800/20',
    badgeBg: 'bg-blue-400/15 text-blue-600 dark:text-blue-300 border-blue-400/30'
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Passing brief shower with sudden clear spells',
    icon: 'CloudSunRain',
    category: 'rain',
    gradient: 'from-sky-500/20 via-blue-600/15 to-slate-800/20',
    badgeBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-400/30'
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Frequent passing showers with heavy bursts',
    icon: 'CloudRain',
    category: 'rain',
    gradient: 'from-blue-600/25 via-indigo-700/20 to-slate-900/25',
    badgeBg: 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Sudden downpours with intense gusty winds',
    icon: 'CloudRainWind',
    category: 'rain',
    gradient: 'from-blue-800/30 via-indigo-950/25 to-slate-950/30',
    badgeBg: 'bg-blue-800/20 text-blue-800 dark:text-blue-200 border-blue-700/30'
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    description: 'Brief passing snow squalls',
    icon: 'Snowflake',
    category: 'snow',
    gradient: 'from-cyan-500/20 via-blue-600/15 to-slate-800/20',
    badgeBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-400/30'
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Intense snow squalls with rapid accumulation',
    icon: 'Snowflake',
    category: 'snow',
    gradient: 'from-cyan-600/25 via-blue-800/20 to-slate-900/25',
    badgeBg: 'bg-cyan-600/20 text-cyan-700 dark:text-cyan-200 border-cyan-500/30'
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Lightning strikes and thunder bursts',
    icon: 'CloudLightning',
    category: 'thunderstorm',
    gradient: 'from-amber-600/20 via-purple-900/25 to-slate-950/30',
    badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Slight Hail',
    description: 'Thunderstorm producing small hail pellets',
    icon: 'CloudLightning',
    category: 'thunderstorm',
    gradient: 'from-purple-600/25 via-slate-900/25 to-slate-950/30',
    badgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
  },
  99: {
    code: 99,
    label: 'Thunderstorm with Heavy Hail',
    description: 'Severe storm with damaging hail stones',
    icon: 'CloudLightning',
    category: 'thunderstorm',
    gradient: 'from-purple-800/30 via-slate-950/30 to-black/40',
    badgeBg: 'bg-purple-700/20 text-purple-700 dark:text-purple-300 border-purple-600/30'
  }
};

export function getWeatherCodeDetail(code: number): WeatherCodeDetail {
  return WMO_WEATHER_CODES[code] || {
    code,
    label: 'Variable Sky',
    description: 'Unspecified weather conditions',
    icon: 'Cloud',
    category: 'cloudy',
    gradient: 'from-slate-500/20 via-slate-600/15 to-slate-800/20',
    badgeBg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30'
  };
}

// Unit conversions
export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempVal(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  switch (unit) {
    case 'mph':
      return `${Math.round(kmh * 0.621371)} mph`;
    case 'ms':
      return `${(kmh / 3.6).toFixed(1)} m/s`;
    case 'knots':
      return `${Math.round(kmh * 0.539957)} kn`;
    case 'kmh':
    default:
      return `${Math.round(kmh)} km/h`;
  }
}

export function formatPrecip(mm: number, unit: PrecipitationUnit): string {
  if (unit === 'inch') {
    const inches = mm * 0.0393701;
    return inches < 0.01 && inches > 0 ? '<0.01 in' : `${inches.toFixed(2)} in`;
  }
  return mm < 0.1 && mm > 0 ? '<0.1 mm' : `${mm.toFixed(1)} mm`;
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export interface UVCategory {
  level: string;
  color: string;
  textColor: string;
  advice: string;
}

export function getUVCategory(uv: number): UVCategory {
  if (uv < 3) {
    return {
      level: 'Low',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      advice: 'No protection required. Safe to enjoy outdoors.'
    };
  } else if (uv < 6) {
    return {
      level: 'Moderate',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      advice: 'Wear sunglasses, apply SPF 30+ sunscreen, seek shade at midday.'
    };
  } else if (uv < 8) {
    return {
      level: 'High',
      color: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      advice: 'Protection needed! Hat, UV sunglasses, SPF 30+ every 2 hours.'
    };
  } else if (uv < 11) {
    return {
      level: 'Very High',
      color: 'bg-red-500',
      textColor: 'text-red-600 dark:text-red-400',
      advice: 'Extra protection required. Avoid sun exposure between 10 AM & 4 PM.'
    };
  } else {
    return {
      level: 'Extreme',
      color: 'bg-purple-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      advice: 'Avoid direct sun exposure! Unprotected skin burns rapidly.'
    };
  }
}

export interface AQICategory {
  label: string;
  color: string;
  badgeClass: string;
  healthDescription: string;
}

export function getAQICategory(usAqi: number): AQICategory {
  if (usAqi <= 50) {
    return {
      label: 'Good',
      color: '#10b981',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      healthDescription: 'Air quality is satisfactory with minimal pollution risk.'
    };
  } else if (usAqi <= 100) {
    return {
      label: 'Moderate',
      color: '#eab308',
      badgeClass: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
      healthDescription: 'Acceptable quality; unusually sensitive individuals should take care.'
    };
  } else if (usAqi <= 150) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      color: '#f97316',
      badgeClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
      healthDescription: 'Sensitive groups may experience health effects; general public unaffected.'
    };
  } else if (usAqi <= 200) {
    return {
      label: 'Unhealthy',
      color: '#ef4444',
      badgeClass: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
      healthDescription: 'Everyone may begin to experience health effects; limit prolonged outdoor exertion.'
    };
  } else if (usAqi <= 300) {
    return {
      label: 'Very Unhealthy',
      color: '#a855f7',
      badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      healthDescription: 'Health alert: risk of health effects for all members of the population.'
    };
  } else {
    return {
      label: 'Hazardous',
      color: '#7f1d1d',
      badgeClass: 'bg-rose-900/30 text-rose-300 border-rose-700/50',
      healthDescription: 'Health warning of emergency conditions. Stay indoors with air filtration.'
    };
  }
}

export function calculateSunPosition(sunriseIso: string, sunsetIso: string, nowIso: string): number {
  const sunrise = new Date(sunriseIso).getTime();
  const sunset = new Date(sunsetIso).getTime();
  const now = new Date(nowIso).getTime();

  if (now <= sunrise) return 0;
  if (now >= sunset) return 100;
  return Math.round(((now - sunrise) / (sunset - sunrise)) * 100);
}

export function formatTimeString(isoString: string, timezone: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone
    }).format(date);
  } catch {
    return isoString.substring(11, 16);
  }
}

export function formatDayString(dateStr: string): { dayName: string; shortDate: string } {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    return { dayName, shortDate };
  } catch {
    return { dayName: dateStr, shortDate: '' };
  }
}

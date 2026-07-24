import { GeoLocation, FullWeatherData, AIBriefingResponse } from '../types';

export const POPULAR_CITIES: GeoLocation[] = [
  { id: 5128581, name: "New York", country: "United States", admin1: "New York", latitude: 40.71427, longitude: -74.00597, timezone: "America/New_York" },
  { id: 2643743, name: "London", country: "United Kingdom", admin1: "England", latitude: 51.50853, longitude: -0.12574, timezone: "Europe/London" },
  { id: 1850147, name: "Tokyo", country: "Japan", admin1: "Tokyo", latitude: 35.6895, longitude: 139.69171, timezone: "Asia/Tokyo" },
  { id: 2988507, name: "Paris", country: "France", admin1: "Île-de-France", latitude: 48.85341, longitude: 2.3488, timezone: "Europe/Paris" },
  { id: 2147714, name: "Sydney", country: "Australia", admin1: "New South Wales", latitude: -33.86785, longitude: 151.20732, timezone: "Australia/Sydney" },
  { id: 292223, name: "Dubai", country: "United Arab Emirates", admin1: "Dubai", latitude: 25.0657, longitude: 55.17128, timezone: "Asia/Dubai" },
  { id: 5391959, name: "San Francisco", country: "United States", admin1: "California", latitude: 37.77493, longitude: -122.41942, timezone: "America/Los_Angeles" },
  { id: 1275339, name: "Mumbai", country: "India", admin1: "Maharashtra", latitude: 19.07283, longitude: 72.88261, timezone: "Asia/Kolkata" }
];

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding service unavailable");
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error searching cities:", err);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const name = data.city || data.locality || data.principalSubdivision || "Current Location";
      return {
        id: Math.floor(lat * 1000 + lon * 1000),
        name,
        country: data.countryName,
        admin1: data.principalSubdivision,
        latitude: lat,
        longitude: lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "auto"
      };
    }
  } catch (e) {
    console.warn("Reverse geocode failed, fallback:", e);
  }

  return {
    id: Date.now(),
    name: "Current Location",
    latitude: lat,
    longitude: lon,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "auto"
  };
}

export async function fetchFullWeatherData(location: GeoLocation): Promise<FullWeatherData> {
  const { latitude, longitude, timezone } = location;
  const tz = timezone || 'auto';

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=${encodeURIComponent(tz)}`;

  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index,european_aqi,us_aqi&timezone=${encodeURIComponent(tz)}`;

  const [forecastRes, aqRes] = await Promise.allSettled([
    fetch(forecastUrl),
    fetch(aqUrl)
  ]);

  if (forecastRes.status === 'rejected' || !forecastRes.value.ok) {
    throw new Error("Failed to fetch weather forecast data");
  }

  const forecastData = await forecastRes.value.json();
  let airQualityData = undefined;

  if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
    try {
      const aqRaw = await aqRes.value.json();
      if (aqRaw.hourly) {
        airQualityData = aqRaw.hourly;
      }
    } catch (e) {
      console.warn("AQ parsing failed:", e);
    }
  }

  return {
    location,
    current: forecastData.current,
    hourly: forecastData.hourly,
    daily: forecastData.daily,
    airQuality: airQualityData,
    fetchedAt: new Date().toISOString()
  };
}

export async function fetchAIBriefing(weatherData: FullWeatherData): Promise<AIBriefingResponse> {
  const currentTemp = Math.round(weatherData.current.temperature_2m);
  const condition = weatherData.current.weather_code;
  const humidity = weatherData.current.relative_humidity_2m;
  const windSpeed = Math.round(weatherData.current.wind_speed_10m);
  const uvIndexMax = weatherData.daily.uv_index_max[0] || 0;
  const precipProb = weatherData.daily.precipitation_probability_max[0] || 0;
  const tempMin = Math.round(weatherData.daily.temperature_2m_min[0]);
  const tempMax = Math.round(weatherData.daily.temperature_2m_max[0]);

  try {
    const res = await fetch("/api/ai/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: `${weatherData.location.name}${weatherData.location.country ? `, ${weatherData.location.country}` : ''}`,
        currentTemp,
        condition,
        humidity,
        windSpeed,
        uvIndexMax,
        precipProb,
        tempMin,
        tempMax
      })
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("AI Briefing fetch failed, fallback:", err);
  }

  // Fallback if API fails
  return {
    executiveSummary: `Current conditions in ${weatherData.location.name} show ${currentTemp}°C with winds around ${windSpeed} km/h. Temperatures expected between ${tempMin}°C and ${tempMax}°C today.`,
    dressRecommendation: currentTemp < 10 ? "Dress in a warm insulated coat and thermal layers." : currentTemp < 20 ? "Wear a comfortable light jacket or fleece sweater." : "Light breathable clothing.",
    outdoorSafetyScore: precipProb > 60 ? 55 : 90,
    smartTips: [
      `Max precipitation chance today is ${precipProb}%.`,
      `UV index peaks around ${uvIndexMax}. Use sun protection during peak daylight.`,
      `Humidity level is currently at ${humidity}%.`
    ],
    isAiGenerated: false
  };
}

export async function askAIChat(message: string, weatherData: FullWeatherData): Promise<string> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        weatherContext: {
          location: `${weatherData.location.name}, ${weatherData.location.country || ''}`,
          currentTemp: Math.round(weatherData.current.temperature_2m),
          condition: weatherData.current.weather_code,
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: Math.round(weatherData.current.wind_speed_10m),
          uvIndexMax: weatherData.daily.uv_index_max[0] || 0,
          precipProb: weatherData.daily.precipitation_probability_max[0] || 0
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch (err) {
    console.warn("AI Chat fetch error:", err);
  }

  return `Based on current weather in ${weatherData.location.name} (${Math.round(weatherData.current.temperature_2m)}°C), make sure to dress appropriately and check local rain forecasts.`;
}

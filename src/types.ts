export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State/Province
  admin2?: string;
  timezone: string;
  population?: number;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number; // 1 or 0
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
}

export interface AirQualityData {
  time: string[];
  european_aqi: number[];
  us_aqi: number[];
  pm10: number[];
  pm2_5: number[];
  carbon_monoxide: number[];
  nitrogen_dioxide: number[];
  sulphur_dioxide: number[];
  ozone: number[];
  dust: number[];
  uv_index: number[];
}

export interface FullWeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  airQuality?: AirQualityData;
  fetchedAt: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'knots';
export type PrecipitationUnit = 'mm' | 'inch';

export interface WeatherUnitsConfig {
  temp: TemperatureUnit;
  wind: WindSpeedUnit;
  precip: PrecipitationUnit;
}

export interface ActivityRating {
  id: string;
  name: string;
  category: 'sports' | 'leisure' | 'nature' | 'practical';
  icon: string;
  score: number; // 0 to 100
  status: 'Ideal' | 'Good' | 'Fair' | 'Poor' | 'Avoid';
  reason: string;
  bestTimeToday?: string;
}

export interface ClothingRecommendation {
  type: 'headwear' | 'top' | 'bottom' | 'footwear' | 'accessories';
  title: string;
  description: string;
  iconName: string;
}

export interface PlanningSummary {
  clothing: ClothingRecommendation[];
  activities: ActivityRating[];
  commuteWarning?: {
    severity: 'info' | 'warning' | 'alert';
    title: string;
    message: string;
  };
  bestWindows: {
    activity: string;
    timeRange: string;
    condition: string;
  }[];
}

export interface AIBriefingResponse {
  executiveSummary: string;
  headlineAlert?: string;
  dressRecommendation: string;
  outdoorSafetyScore: number; // 0-100
  smartTips: string[];
  isAiGenerated: boolean;
}

export interface FavoriteLocation {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  addedAt: string;
}

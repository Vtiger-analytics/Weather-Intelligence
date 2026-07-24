import { FullWeatherData, PlanningSummary, ActivityRating, ClothingRecommendation } from '../types';
import { getWeatherCodeDetail } from './weatherUtils';

export function generatePlanningSummary(data: FullWeatherData): PlanningSummary {
  const current = data.current;
  const tempC = current.temperature_2m;
  const windKmh = current.wind_speed_10m;
  const code = current.weather_code;
  const weatherDetail = getWeatherCodeDetail(code);
  const isRain = weatherDetail.category === 'rain' || current.precipitation > 0.1;
  const isSnow = weatherDetail.category === 'snow' || current.snowfall > 0;
  const isStorm = weatherDetail.category === 'thunderstorm';
  const isFog = weatherDetail.category === 'fog';

  // 1. Clothing Recommendations
  const clothing: ClothingRecommendation[] = [];

  // Tops & Layering
  if (tempC < 0) {
    clothing.push({
      type: 'top',
      title: 'Heavy Thermal Coat',
      description: 'Wear a insulated parka or heavy winter down jacket with thermal base layers.',
      iconName: 'Shirt'
    });
  } else if (tempC < 10) {
    clothing.push({
      type: 'top',
      title: 'Warm Fleece / Coat',
      description: 'Opt for a warm winter jacket, fleece jacket, or wool sweater with base layer.',
      iconName: 'Shirt'
    });
  } else if (tempC < 18) {
    clothing.push({
      type: 'top',
      title: 'Light Jacket / Sweater',
      description: 'Comfortable in a windbreaker, hoodie, cardigan, or light denim jacket.',
      iconName: 'Shirt'
    });
  } else if (tempC < 26) {
    clothing.push({
      type: 'top',
      title: 'Breathable T-Shirt',
      description: 'Short sleeve shirt, light cotton tops, or linen button-down.',
      iconName: 'Shirt'
    });
  } else {
    clothing.push({
      type: 'top',
      title: 'Ultra-Light Breathable Wear',
      description: 'Sleeveless or loose-fitting breathable athletic clothing to keep cool.',
      iconName: 'Shirt'
    });
  }

  // Accessories & Gear
  if (isRain || isStorm) {
    clothing.push({
      type: 'accessories',
      title: 'Waterproof Umbrella / Shell',
      description: 'Sturdy wind-resistant umbrella and waterproof rain jacket with hood.',
      iconName: 'Umbrella'
    });
  } else if (data.hourly.uv_index && Math.max(...data.hourly.uv_index.slice(0, 24)) > 5) {
    clothing.push({
      type: 'accessories',
      title: 'UV Protection & Sunglasses',
      description: 'Polarized sunglasses, wide-brim hat, and broad-spectrum SPF 30+ sunscreen.',
      iconName: 'Glasses'
    });
  } else if (windKmh > 25) {
    clothing.push({
      type: 'accessories',
      title: 'Wind-blocking Scarf / Shell',
      description: 'Wind-resistant outerwear and neck gaiter to buffer against high gusts.',
      iconName: 'Wind'
    });
  } else if (tempC < 5) {
    clothing.push({
      type: 'accessories',
      title: 'Beanie & Insulated Gloves',
      description: 'Thermal knit hat, neck warmer, and touchscreen-compatible gloves.',
      iconName: 'Sparkles'
    });
  }

  // Footwear
  if (isSnow) {
    clothing.push({
      type: 'footwear',
      title: 'Waterproof Winter Boots',
      description: 'Insulated waterproof boots with deep lugged soles for traction on ice/snow.',
      iconName: 'Footprints'
    });
  } else if (isRain) {
    clothing.push({
      type: 'footwear',
      title: 'Rain Boots / Water-resistant Shoes',
      description: 'Waterproof footwear or water-treated sneakers to keep feet dry.',
      iconName: 'Footprints'
    });
  } else if (tempC > 24) {
    clothing.push({
      type: 'footwear',
      title: 'Breathable Sneakers / Sandals',
      description: 'Ventilated mesh running shoes or open sandals for warm airflow.',
      iconName: 'Footprints'
    });
  } else {
    clothing.push({
      type: 'footwear',
      title: 'Standard Walking Shoes',
      description: 'Comfortable everyday sneakers or leather boots.',
      iconName: 'Footprints'
    });
  }

  // 2. Activity Ratings
  const maxUvToday = Math.max(...(data.hourly.uv_index?.slice(0, 24) || [0]));
  const maxRainProb = Math.max(...(data.hourly.precipitation_probability?.slice(0, 24) || [0]));

  const activities: ActivityRating[] = [
    evaluateRunning(tempC, windKmh, isRain, isSnow, isStorm, maxRainProb),
    evaluateCycling(tempC, windKmh, isRain, isSnow, isStorm),
    evaluateOutdoorDining(tempC, windKmh, isRain, isSnow, isStorm, current.cloud_cover),
    evaluateStargazing(current.cloud_cover, current.is_day, isRain, isStorm, isFog),
    evaluatePhotography(current.cloud_cover, isRain, isStorm, isFog, weatherDetail.category),
    evaluateGardening(tempC, windKmh, isRain, isSnow, isStorm),
    evaluateBeachPool(tempC, current.cloud_cover, isRain, maxUvToday, windKmh),
    evaluateDroneFlying(windKmh, current.wind_gusts_10m, isRain, isSnow, isFog)
  ];

  // 3. Travel & Commute Warnings
  let commuteWarning: PlanningSummary['commuteWarning'] = undefined;
  if (isStorm) {
    commuteWarning = {
      severity: 'alert',
      title: 'Severe Weather Warning',
      message: 'Active thunderstorm in the region. Drive cautiously, watch for lightning, and avoid flooded roadways.'
    };
  } else if (isSnow || current.snowfall > 0) {
    commuteWarning = {
      severity: 'warning',
      title: 'Winter Travel Advisory',
      message: 'Snow and icy surface conditions detected. Increase vehicle stopping distance and drive at reduced speeds.'
    };
  } else if (current.wind_gusts_10m > 50) {
    commuteWarning = {
      severity: 'warning',
      title: 'High Wind Gust Alert',
      message: `Wind gusts exceeding ${Math.round(current.wind_gusts_10m)} km/h. High-profile vehicles should exercise extra caution on bridges.`
    };
  } else if (isRain && current.precipitation > 2) {
    commuteWarning = {
      severity: 'info',
      title: 'Wet Road Advisory',
      message: 'Slick roads and spray reduced visibility. Maintain safe trailing distance and use low-beam headlights.'
    };
  } else if (isFog) {
    commuteWarning = {
      severity: 'warning',
      title: 'Dense Fog Advisory',
      message: 'Atmospheric fog is impairing visibility. Use fog lights and reduce driving speeds.'
    };
  }

  // 4. Best Time Windows Today
  const bestWindows: PlanningSummary['bestWindows'] = [];
  const times = data.hourly.time.slice(0, 24);
  const temps = data.hourly.temperature_2m.slice(0, 24);
  const precips = data.hourly.precipitation_probability?.slice(0, 24) || new Array(24).fill(0);

  // Find lowest rain chance window
  let minPrecipIdx = 0;
  for (let i = 0; i < precips.length; i++) {
    if (precips[i] < precips[minPrecipIdx]) minPrecipIdx = i;
  }
  const bestHourStr = times[minPrecipIdx] ? times[minPrecipIdx].substring(11, 16) : 'Afternoon';

  bestWindows.push({
    activity: 'Outdoor Workouts & Walks',
    timeRange: `${bestHourStr} (${precips[minPrecipIdx]}% rain chance)`,
    condition: `Optimal temperature (${Math.round(temps[minPrecipIdx])}°C) and minimal rain probability.`
  });

  return {
    clothing,
    activities,
    commuteWarning,
    bestWindows
  };
}

// Activity Evaluators
function evaluateRunning(temp: number, wind: number, rain: boolean, snow: boolean, storm: boolean, maxRainProb: number): ActivityRating {
  let score = 95;
  let reasons: string[] = [];

  if (storm) return { id: 'running', name: 'Running & Jogging', category: 'sports', icon: 'Activity', score: 10, status: 'Avoid', reason: 'Unsafe lightning conditions.' };
  if (temp < -5) { score -= 40; reasons.push('Extreme cold'); }
  else if (temp < 5) { score -= 15; reasons.push('Chilly air'); }
  else if (temp > 28) { score -= 30; reasons.push('High heat & humidity'); }
  else if (temp >= 12 && temp <= 22) { score += 5; reasons.push('Ideal running temperature'); }

  if (wind > 30) { score -= 25; reasons.push('Heavy headwind'); }
  if (rain) { score -= 35; reasons.push('Rainy paths'); }
  if (snow) { score -= 45; reasons.push('Slippery snow'); }

  score = Math.max(10, Math.min(100, score));
  return {
    id: 'running',
    name: 'Running & Jogging',
    category: 'sports',
    icon: 'Activity',
    score,
    status: getStatusFromScore(score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Great weather for a outdoor jog!'
  };
}

function evaluateCycling(temp: number, wind: number, rain: boolean, snow: boolean, storm: boolean): ActivityRating {
  let score = 90;
  let reasons: string[] = [];

  if (storm || snow) return { id: 'cycling', name: 'Road Cycling', category: 'sports', icon: 'Bike', score: 10, status: 'Avoid', reason: 'High risk of slipping or storm danger.' };
  if (wind > 35) { score -= 45; reasons.push('Strong dangerous wind gusts'); }
  else if (wind > 20) { score -= 20; reasons.push('Moderate wind drag'); }

  if (rain) { score -= 40; reasons.push('Wet asphalt impairs braking'); }
  if (temp < 2) { score -= 35; reasons.push('Freezing conditions'); }
  if (temp > 32) { score -= 30; reasons.push('Heat stroke risk'); }

  score = Math.max(10, Math.min(100, score));
  return {
    id: 'cycling',
    name: 'Road Cycling',
    category: 'sports',
    icon: 'Bike',
    score,
    status: getStatusFromScore(score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Smooth cycling conditions.'
  };
}

function evaluateOutdoorDining(temp: number, wind: number, rain: boolean, snow: boolean, storm: boolean, clouds: number): ActivityRating {
  let score = 90;
  let reasons: string[] = [];

  if (rain || snow || storm) return { id: 'dining', name: 'Outdoor Dining & BBQ', category: 'leisure', icon: 'Utensils', score: 15, status: 'Avoid', reason: 'Precipitation or storm forces indoor dining.' };
  if (temp < 15) { score -= 35; reasons.push('Chilly patio weather; heaters needed'); }
  if (temp > 30) { score -= 25; reasons.push('Hot patio; shade required'); }
  if (wind > 25) { score -= 30; reasons.push('Breezy conditions may blow items'); }

  score = Math.max(10, Math.min(100, score));
  return {
    id: 'dining',
    name: 'Outdoor Dining & BBQ',
    category: 'leisure',
    icon: 'Utensils',
    score,
    status: getStatusFromScore(score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Pleasant patio and outdoor dining climate.'
  };
}

function evaluateStargazing(clouds: number, isDay: number, rain: boolean, storm: boolean, fog: boolean): ActivityRating {
  if (isDay === 1) {
    return {
      id: 'stargazing',
      name: 'Stargazing',
      category: 'nature',
      icon: 'Moon',
      score: 10,
      status: 'Avoid',
      reason: 'Sunlight present; wait until astronomical dusk.'
    };
  }

  let score = 100 - clouds;
  let reasons: string[] = [];
  if (rain || storm || fog) return { id: 'stargazing', name: 'Stargazing', category: 'nature', icon: 'Moon', score: 5, status: 'Avoid', reason: 'Sky obscured by precipitation or thick fog.' };

  if (clouds < 20) reasons.push('Crystal clear night sky');
  else if (clouds > 70) reasons.push('Heavy cloud cover blocking stars');

  score = Math.max(5, Math.min(100, score));
  return {
    id: 'stargazing',
    name: 'Stargazing',
    category: 'nature',
    icon: 'Moon',
    score,
    status: getStatusFromScore(score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Clear night view.'
  };
}

function evaluatePhotography(clouds: number, rain: boolean, storm: boolean, fog: boolean, category: string): ActivityRating {
  let score = 80;
  let reasons: string[] = [];

  if (fog) {
    return { id: 'photography', name: 'Landscape Photography', category: 'leisure', icon: 'Camera', score: 85, status: 'Ideal', reason: 'Dramatic foggy atmospheric shots.' };
  }
  if (storm) return { id: 'photography', name: 'Landscape Photography', category: 'leisure', icon: 'Camera', score: 30, status: 'Poor', reason: 'Protect equipment from heavy lightning & rain.' };

  if (clouds >= 30 && clouds <= 70) {
    score += 15;
    reasons.push('Soft diffused cloud lighting and dramatic sky textures');
  } else if (clouds < 15) {
    reasons.push('Bright harsh direct sunlight');
  }

  if (rain) { score -= 25; reasons.push('Waterproof camera gear needed'); }

  score = Math.max(10, Math.min(100, score));
  return {
    id: 'photography',
    name: 'Landscape Photography',
    category: 'leisure',
    icon: 'Camera',
    score,
    status: getStatusFromScore(score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Good lighting balance.'
  };
}

function evaluateGardening(temp: number, wind: number, rain: boolean, snow: boolean, storm: boolean): ActivityRating {
  let score = 85;
  let reasons: string[] = [];

  if (storm || snow) return { id: 'gardening', name: 'Gardening & Lawncare', category: 'practical', icon: 'Sprout', score: 10, status: 'Avoid', reason: 'Freezing soil or storm safety hazards.' };
  if (temp < 5) { score -= 50; reasons.push('Frost risk for delicate plants'); }
  if (rain) { score += 10; reasons.push('Natural rainfall waters plants; avoid muddy soil compaction'); }
  if (wind > 30) { score -= 35; reasons.push('High wind damages tall stems'); }

  score = Math.max(10, Math.min(100, score));
  return {
    id: 'gardening',
    name: 'Gardening & Lawncare',
    category: 'practical',
    icon: 'Sprout',
    score,
    status: getStatusFromScore(score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Good soil & outdoor plant working weather.'
  };
}

function evaluateBeachPool(temp: number, clouds: number, rain: boolean, uvMax: number, wind: number): ActivityRating {
  let score = 85;
  let reasons: string[] = [];

  if (rain || temp < 20) {
    return { id: 'beach', name: 'Beach & Pool', category: 'leisure', icon: 'Sun', score: 15, status: 'Avoid', reason: 'Too chilly or rainy for swimming.' };
  }

  if (temp >= 28) { score += 10; reasons.push('Hot weather suitable for swimming'); }
  if (clouds > 60) { score -= 30; reasons.push('Overcast cloud cover reduces warmth'); }
  if (wind > 25) { score -= 20; reasons.push('Breezy sand blowing at beach'); }

  score = Math.max(10, Math.min(100, score));
  return {
    id: 'beach',
    name: 'Beach & Pool',
    category: 'leisure',
    icon: 'Sun',
    score,
    status: getStatusFromScore(score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Sunny & warm for watersports or relaxation.'
  };
}

function evaluateDroneFlying(wind: number, gusts: number, rain: boolean, snow: boolean, fog: boolean): ActivityRating {
  let score = 95;
  let reasons: string[] = [];

  if (rain || snow || fog) {
    return { id: 'drone', name: 'Drone Aerial Flying', category: 'practical', icon: 'Compass', score: 10, status: 'Avoid', reason: 'Moisture damages rotors & sensors; low visibility.' };
  }

  if (gusts > 40 || wind > 30) {
    return { id: 'drone', name: 'Drone Aerial Flying', category: 'practical', icon: 'Compass', score: 15, status: 'Avoid', reason: 'Dangerous wind gusts exceed drone stabilizer limits.' };
  } else if (wind > 20) {
    score -= 35;
    reasons.push('Breezy winds reduce battery life and flight stability');
  }

  score = Math.max(10, Math.min(100, score));
  return {
    id: 'drone',
    name: 'Drone Aerial Flying',
    category: 'practical',
    icon: 'Compass',
    score,
    status: getStatusFromScore(score),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Calm air with clear line of sight.'
  };
}

function getStatusFromScore(score: number): ActivityRating['status'] {
  if (score >= 85) return 'Ideal';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Poor';
  return 'Avoid';
}

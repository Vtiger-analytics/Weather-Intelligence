# Weather Intelligence App 🌤️

An AI-enhanced, responsive weather intelligence and activity planning web application powered by public weather telemetry from **Open-Meteo** and smart weather briefings powered by **Google Gemini 3.6 Flash**.

---

## 🌟 Key Features

- **Free Public Weather Data**: Utilizes Open-Meteo's open-access global meteorological and air quality APIs with zero API keys required for weather telemetry.
- **Real-Time Current Weather**:
  - High-precision temperature and "Feels Like" metrics.
  - Solar cycle arc tracking sunrise, sunset, and real-time solar progression.
  - Wind speed & direction compass, peak UV index, humidity, surface pressure, cloud cover, and dew point.
- **24-Hour Interactive Hourly Forecasts**:
  - Recharts visual trend graphs for Temperature, Rain Probability, Wind Speed, and UV / Cloud cover.
  - Horizontal scrollable hourly weather cards.
- **7-Day Extended Outlook**:
  - Visual temperature spectrum bars comparing relative 7-day ranges.
  - Expandable daily deep-dives with solar times, max UV warnings, and precipitation totals.
- **Activity & Clothing Planning Engine**:
  - Automated clothing concierge providing layering advice based on current wind, temperature, and rain.
  - Outdoor suitability index (0-100%) for running, cycling, patio dining, stargazing, landscape photography, gardening, beach, and drone flying.
  - Travel and commute advisories for thunderstorms, snow/ice, fog, or extreme winds.
- **AeroIntel AI Briefing & Chat**:
  - Gemini 3.6 Flash synthesized weather intelligence briefings with headline alerts and safety scores.
  - Interactive AI Weather Assistant (`AeroIntel`) for personalized outdoor queries.
- **Global Search & Geolocation**:
  - Fast autocomplete location search with country/state labels.
  - One-click browser Geolocation lookup with reverse geocoding.
- **Saved Locations & Custom Units**:
  - Local persistence for favorite saved cities.
  - Instant unit switching (°C / °F, km/h / mph / m/s / knots).
- **Air Quality Monitor**:
  - US AQI and European AQI indices with pollutant breakdowns (PM2.5, PM10, O₃, NO₂).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Backend / API Server**: Node.js, Express, `tsx`, `esbuild`
- **Weather Data Source**: [Open-Meteo Weather API](https://open-meteo.com/) (Public, free access)
- **AI Synthesis**: Google Gemini API (`@google/genai` SDK with `gemini-3.6-flash`)
- **Data Visualizations**: Recharts
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weather-intelligence
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for AI features):
   ```env
   # .env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 API Integrations

- **Forecast API**: `https://api.open-meteo.com/v1/forecast`
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
- **Air Quality API**: `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Reverse Geocoding**: `https://api.bigdatacloud.net/data/reverse-geocode-client`
- **AI Intelligence Server**: `/api/ai/briefing` and `/api/ai/chat` proxied server-side via Google Gemini 3.6 Flash.

---

## 📄 License

Apache 2.0 / MIT License.

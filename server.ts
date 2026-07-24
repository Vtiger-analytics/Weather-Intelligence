import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI lazily
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Briefing Endpoint
app.post("/api/ai/briefing", async (req, res) => {
  try {
    const { location, currentTemp, condition, humidity, windSpeed, uvIndexMax, precipProb, tempMin, tempMax } = req.body;

    const ai = getGenAIClient();
    if (!ai) {
      // Fallback deterministic briefing
      return res.json({
        executiveSummary: `Currently ${currentTemp}°C and ${condition} in ${location}. Temperatures will range between ${tempMin}°C and ${tempMax}°C today with wind at ${windSpeed} km/h.`,
        headlineAlert: precipProb > 50 ? "High probability of rain today. Carry waterproof gear." : undefined,
        dressRecommendation: currentTemp < 12 ? "Wear a warm coat, fleece layer, and wind-blocking scarf." : currentTemp < 22 ? "Wear a light jacket or long-sleeve top." : "Short sleeves and light breathable clothing.",
        outdoorSafetyScore: precipProb > 70 || windSpeed > 40 ? 45 : 88,
        smartTips: [
          `Peak precipitation chance is around ${precipProb}%.`,
          `UV Index max reaches ${uvIndexMax}. Apply sunscreen if spending >30 mins outdoors.`,
          `Wind speeds averaging ${windSpeed} km/h.`
        ],
        isAiGenerated: false
      });
    }

    const prompt = `Analyze this weather data for ${location} and generate a structured Weather Intelligence Briefing:
- Location: ${location}
- Current Temp: ${currentTemp}°C (Day Range: ${tempMin}°C to ${tempMax}°C)
- Condition: ${condition}
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} km/h
- Max UV Index: ${uvIndexMax}
- Max Rain Probability: ${precipProb}%

Provide a high-value, crisp intelligence briefing with tailored advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite meteorologist and outdoor planning AI consultant. Respond ONLY in valid JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING, description: "A punchy 2-sentence executive summary of today's weather impact" },
            headlineAlert: { type: Type.STRING, description: "Short urgent alert string if weather is notable (e.g. high winds, heavy rain, frost, UV spike), else empty" },
            dressRecommendation: { type: Type.STRING, description: "Actionable clothing layering advice" },
            outdoorSafetyScore: { type: Type.NUMBER, description: "Overall outdoor suitability rating from 0 to 100" },
            smartTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 highly specific, actionable outdoor planning tips for today"
            }
          },
          required: ["executiveSummary", "dressRecommendation", "outdoorSafetyScore", "smartTips"]
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : "";
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch {
      data = {
        executiveSummary: `Current condition in ${location}: ${currentTemp}°C, ${condition}.`,
        dressRecommendation: "Standard seasonal dress.",
        outdoorSafetyScore: 80,
        smartTips: ["Stay hydrated", "Check local forecasts", "Dress in comfortable layers"]
      };
    }

    res.json({
      ...data,
      isAiGenerated: true
    });
  } catch (error) {
    console.error("AI Briefing Error:", error);
    res.status(500).json({ error: "Failed to generate AI weather briefing" });
  }
});

// AI Assistant Chat Route
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, weatherContext } = req.body;

    const ai = getGenAIClient();
    if (!ai) {
      return res.json({
        reply: `Based on the weather in ${weatherContext?.location || 'your area'} (${weatherContext?.currentTemp || ''}°C, ${weatherContext?.condition || ''}), make sure to check local wind and precipitation forecasts before heading out.`
      });
    }

    const systemPrompt = `You are "AeroIntel", an expert AI Weather Assistant embedded inside a Weather Intelligence web application.
Current Weather Context:
- City: ${weatherContext?.location || 'Unknown'}
- Temp: ${weatherContext?.currentTemp}°C (${weatherContext?.condition})
- Humidity: ${weatherContext?.humidity}%
- Wind: ${weatherContext?.windSpeed} km/h
- Max UV: ${weatherContext?.uvIndexMax}
- Rain Probability: ${weatherContext?.precipProb}%

Provide short, clear, helpful, and friendly advice tailored to the user's query and current weather context. Use Markdown formatting when appropriate. Keep responses under 150 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({
      reply: response.text || "I am unable to answer at the moment. Please try again."
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Weather Intelligence server listening on port ${PORT}`);
  });
}

startServer();

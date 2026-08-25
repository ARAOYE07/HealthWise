import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. SAFETY GUARDRAIL: Emergency Keywords (Simulating Edge Function Logic)
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', 'suicide', 'kill myself', 
  'bleeding heavily', 'can\'t breathe', 'unconscious', 'overdose'
];

function checkSafetyRules(concern: string): { isEmergency: boolean; reason?: string } {
  const lowerConcern = concern.toLowerCase();
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (lowerConcern.includes(keyword)) {
      return { isEmergency: true, reason: `Emergency keyword matched: ${keyword}` };
    }
  }
  return { isEmergency: false };
}

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Assessment endpoint (Mimicking Supabase Edge Function API Contract)
app.post('/api/assess', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !data.concern) {
      return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Please provide the required concern information.' } });
    }

    // Safety Pre-flight Check
    const safetyCheck = checkSafetyRules(data.concern);
    if (safetyCheck.isEmergency) {
      return res.json({
        summary: "Your symptoms require immediate attention.",
        explanation: "The symptoms you described can be associated with serious medical emergencies.",
        recommendations: [
          "Call emergency services (e.g., 911) immediately.", 
          "Go to the nearest emergency room.", 
          "Do not drive yourself if you are experiencing severe symptoms."
        ],
        warning_signs: ["Severe pain", "Difficulty breathing", "Loss of consciousness"],
        safety_level: "EMERGENCY",
        disclaimer: "This is an automated safety warning. Seek professional medical help immediately."
      });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Returning mocked response.');
      return res.json({
        summary: "Based on your description, this appears to be a common concern.",
        explanation: "These symptoms can sometimes be associated with general fatigue or minor seasonal changes. It is a general sign that your body may need more rest.",
        recommendations: [
          "Maintain adequate hydration",
          "Get appropriate rest (7-9 hours per night)",
          "Monitor symptoms for a few days",
          "Consider speaking with a healthcare professional if symptoms persist"
        ],
        warning_signs: ["If symptoms worsen", "If you develop a high fever"],
        safety_level: "LOW",
        disclaimer: "This information is for educational purposes and does not replace professional medical advice."
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
    You are an expert health educator and wellness advisor AI for the "HealthWise" application. 
    Analyze the following user assessment data and provide general health education and wellness advice.
    
    IMPORTANT RULES:
    1. DO NOT diagnose diseases.
    2. DO NOT prescribe medication or treatment.
    3. Clearly distinguish general wellness info from professional medical advice.
    4. Categorize safety_level as: LOW, MODERATE, URGENT, or EMERGENCY.
    
    User Assessment Data:
    ${JSON.stringify(data, null, 2)}
    
    Return ONLY a JSON object with the exact following structure (no markdown blocks, just raw JSON):
    {
      "summary": "Short plain-language summary",
      "explanation": "General educational information starting with 'These symptoms can sometimes be associated with...'",
      "recommendations": ["Actionable safe practice 1", "Actionable safe practice 2"],
      "warning_signs": ["When to seek care 1"],
      "safety_level": "LOW",
      "disclaimer": "This information is for educational purposes and does not replace professional medical advice."
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const textResponse = response.text || "{}";
    const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const result = JSON.parse(cleanedText);
    
    // Simulate AI Usage Logging
    console.log(`[AI_USAGE_LOG] Model: gemini-2.5-flash | Category: ${data.category || 'General'} | Success: true`);

    res.json(result);
  } catch (error) {
    console.error('Error processing assessment:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to process assessment' } });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  import('vite').then(async ({ createServer }) => {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

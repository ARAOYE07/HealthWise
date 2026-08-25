import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.1.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 1. SAFETY GUARDRAIL: Emergency Keywords
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verify User
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { concern, category, age, relevant_information } = await req.json();

    if (!concern) {
      return new Response(JSON.stringify({ error: 'Concern is required' }), { status: 400, headers: corsHeaders });
    }

    // 2. SAFETY GUARDRAIL: Pre-flight check
    const safetyCheck = checkSafetyRules(concern);
    if (safetyCheck.isEmergency) {
      const emergencyResponse = {
        summary: "Your symptoms require immediate attention.",
        educational_information: "The symptoms you described can be associated with serious medical emergencies.",
        recommendations: ["Call emergency services (e.g., 911) immediately.", "Go to the nearest emergency room.", "Do not drive yourself if you are experiencing severe symptoms."],
        warning_signs: ["Severe pain", "Difficulty breathing", "Loss of consciousness"],
        safety_level: "EMERGENCY",
        disclaimer: "This is an automated safety warning. Seek professional medical help immediately."
      };

      // Store flagged assessment using Service Role (bypassing RLS for system actions)
      const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
      
      const { data: assessment } = await supabaseAdmin.from('health_assessments').insert({
        user_id: user.id, category, concern, status: 'flagged'
      }).select().single();

      if (assessment) {
        await supabaseAdmin.from('health_advice').insert({
          assessment_id: assessment.id, user_id: user.id, ...emergencyResponse
        });
      }

      return new Response(JSON.stringify(emergencyResponse), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3. AI PROCESSING (Gemini)
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) throw new Error("Missing AI configuration");
    
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const systemPrompt = `
      You are HealthWise, an AI health education assistant. 
      Analyze the user's input and provide structured educational information.
      
      RULES:
      1. DO NOT diagnose.
      2. DO NOT prescribe medication.
      3. Classify safety_level as LOW, MODERATE, URGENT, or EMERGENCY.
      
      User Concern: ${concern}
      Context: Age ${age || 'Unknown'}, ${JSON.stringify(relevant_information || {})}
      
      Return valid JSON exactly matching this structure:
      {
        "summary": "Plain language summary",
        "educational_information": "Information starting with 'These symptoms can sometimes be associated with...'",
        "recommendations": ["Actionable safe practice 1", "Actionable safe practice 2"],
        "warning_signs": ["When to seek care 1"],
        "safety_level": "LOW"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    const textResponse = response.text || "{}";
    const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiResult = JSON.parse(cleanedText);

    // 4. DATABASE STORAGE
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    
    // Log AI Usage
    await supabaseAdmin.from('ai_usage').insert({
      user_id: user.id, model: 'gemini-2.5-flash', prompt_category: category, success: true
    });

    // Save Assessment
    const { data: assessment } = await supabaseAdmin.from('health_assessments').insert({
      user_id: user.id, category, concern, relevant_information, status: 'completed'
    }).select().single();

    // Save Advice
    if (assessment) {
      await supabaseAdmin.from('health_advice').insert({
        assessment_id: assessment.id,
        user_id: user.id,
        summary: aiResult.summary,
        educational_information: aiResult.educational_information,
        recommendations: aiResult.recommendations,
        warning_signs: aiResult.warning_signs,
        safety_level: aiResult.safety_level,
        disclaimer: "This information is for educational purposes and does not replace professional medical advice."
      });
    }

    return new Response(JSON.stringify(aiResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

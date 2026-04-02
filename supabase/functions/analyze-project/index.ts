import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, description, crop_type, location } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an agriculture expert AI for the Rwanda Agriculture Management System. Analyze this project and return a JSON response.

Project Details:
- Name: ${name}
- Description: ${description || "Not provided"}
- Crop Type: ${crop_type || "Not specified"}
- Location: ${location || "Not specified"}

Return a JSON object with these fields:
- tags: array of 3-5 relevant tags (e.g. "food security", "export crop", "irrigation needed")
- category: one of "Food Crops", "Cash Crops", "Livestock", "Horticulture", "Agroforestry", "Mixed Farming"
- recommendations: 2-3 sentences with soil and growth recommendations specific to the crop and location in Rwanda
- priority: "High", "Medium", or "Low" based on impact and feasibility
- summary: A concise 2-sentence project summary for the AMS dashboard`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an agriculture expert. Always respond with valid JSON only, no markdown." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_project",
              description: "Return structured analysis of an agriculture project",
              parameters: {
                type: "object",
                properties: {
                  tags: { type: "array", items: { type: "string" } },
                  category: { type: "string", enum: ["Food Crops", "Cash Crops", "Livestock", "Horticulture", "Agroforestry", "Mixed Farming"] },
                  recommendations: { type: "string" },
                  priority: { type: "string", enum: ["High", "Medium", "Low"] },
                  summary: { type: "string" },
                },
                required: ["tags", "category", "recommendations", "priority", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_project" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("No tool call in response");
  } catch (e) {
    console.error("analyze-project error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

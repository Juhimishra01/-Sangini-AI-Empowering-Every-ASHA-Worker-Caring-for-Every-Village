// @ts-nocheck
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const generateHealthInsights = async (stats, patients) => {
  const patientSummary = patients.map((p) =>
    `${p.name} (${p.age}yr, ${p.type}, Risk: ${p.riskLevel})`
  ).join("\n");

  const prompt = `You are a public health analyst. Analyze this village health data and generate exactly 4 insights for an ASHA worker. Return ONLY a JSON object, no markdown, no extra text.

Village: Rampur Khera, Delhi
Total patients: ${stats.total}
High risk: ${stats.highRisk}
Pregnant: ${stats.pregnant}
Chronic: ${stats.chronic}

Patients:
${patientSummary}

Return this exact format:
{"insights":[{"type":"urgent","title":"title here","message":"message here","action":"action here"},{"type":"warning","title":"title here","message":"message here","action":"action here"},{"type":"info","title":"title here","message":"message here","action":"action here"},{"type":"info","title":"title here","message":"message here","action":"action here"}]}`;

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return {
          insights: [
            {
              type: "urgent",
              title: "High risk patients need attention",
              message: `${stats.highRisk} patients are high risk in your village.`,
              action: "Schedule immediate follow-up visits"
            },
            {
              type: "warning", 
              title: "Pregnant women monitoring",
              message: `${stats.pregnant} pregnant women need regular ANC checkups.`,
              action: "Confirm next ANC visit dates"
            },
            {
              type: "info",
              title: "Chronic disease follow-ups",
              message: `${stats.chronic} patients have chronic conditions.`,
              action: "Check medicine adherence this week"
            },
            {
              type: "info",
              title: "Village health status",
              message: `Total ${stats.total} patients registered in your village.`,
              action: "Update patient records regularly"
            }
          ]
        };
      }
    }
  }
};
// @ts-nocheck
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Sangini AI, a helpful digital health assistant for ASHA (Accredited Social Health Activist) workers in rural India.

Your role is to:
- Provide clear, simple guidance on maternal health, child health, vaccinations, and chronic diseases
- Help ASHA workers make decisions about patient care and follow-ups
- Give advice based on India's National Health Mission guidelines
- Suggest when to refer patients to PHC (Primary Health Centre) or higher facilities
- Keep responses simple, practical and actionable

Important rules:
- Always remind that you are a decision-support tool, not a replacement for doctors
- Keep responses concise and easy to understand
- Use simple language suitable for field health workers
- For serious symptoms, always recommend immediate referral
- Focus on preventive care and early intervention

You are assisting ASHA workers in Rampur Khera village, Najafgarh Block, Delhi.`;

export const askGemini = async (userMessage: string, conversationHistory = []) => {
  try {
    const messages = [
      ...conversationHistory,
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    return {
      text: reply,
      history: [
        ...messages,
        {
          role: "model",
          parts: [{ text: reply }],
        },
      ],
    };
  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
};
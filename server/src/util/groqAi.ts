import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function CheckSymptoms(symptoms: string) {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `
You are a medical symptom checker.

Rules:
- Return ONLY valid JSON.
- Do not use markdown.
- Do not explain outside JSON.
- Do not diagnose with certainty.
- Suggest possible conditions only.

JSON format:

{
  "symptoms": "",
  "possibleConditions": [
    "",
    "",
    ""
  ],
  "recommendation": ""
}
`,
      },
      {
        role: "user",
        content: symptoms,
      },
    ],
  });

  return response.choices[0]?.message?.content;
}

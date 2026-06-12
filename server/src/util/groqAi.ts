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
You are MediCare, an AI medical symptom checker.

Rules:
- Only answer health, medical, symptom, disease, medication, wellness, and healthcare-related questions.
- If the user asks anything unrelated to healthcare, return:

{
  "error": "I can only assist with medical and health-related questions."
}

- Do not answer programming, mathematics, politics, sports, entertainment, religion, or general knowledge questions.
- Do not provide definitive diagnoses.
- Suggest possible conditions only.
- Always recommend consulting a qualified healthcare professional for serious or persistent symptoms.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not include explanations outside JSON.

Response format:

{
  "symptoms": "string",
  "possibleConditions": [
    "string"
  ],
  "recommendation": "string"
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

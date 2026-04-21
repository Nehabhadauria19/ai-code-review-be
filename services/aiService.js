const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Extract valid JSON safely
function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}

async function analyzeCode(code) {
const prompt = `
You are a strict senior software engineer performing a professional code review.

Rules:
- ALWAYS return valid JSON only
- DO NOT skip issues
- Be strict: even small issues must be reported
- If code uses "var", flag it as a best practice issue
- If code can be improved, include it

Return format:
{
  "bugs": [],
  "security": [],
  "performance": [],
  "bestPractices": [],
  "severity": "low|medium|high",
  "suggestions": []
}

Now review this code:

${code}
`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
  });

  const raw = response.choices[0].message.content;

  console.log("RAW AI RESPONSE:", raw); // 👈 debug

  const parsed = extractJSON(raw);

  // ✅ ALWAYS return safe structure
  return {
    bugs: parsed?.bugs || [],
    security: parsed?.security || [],
    performance: parsed?.performance || [],
    bestPractices: parsed?.bestPractices || [],
    severity: parsed?.severity || "low",
    suggestions: parsed?.suggestions || [],
  };
}

module.exports = analyzeCode;
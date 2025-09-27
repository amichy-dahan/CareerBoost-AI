// ai-integration/gemini.service.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Force valid JSON back including the tailored resume text
const responseSchema = {
  type: "object",
  properties: {
    readinessScore: { type: "integer", minimum: 0, maximum: 100 },
    strengths: { type: "array", items: { type: "string" } },
    improvements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          area: { type: "string" },
          suggestion: { type: "string" }
        },
        required: ["area", "suggestion"]
      }
    },
    missingKeywords: { type: "array", items: { type: "string" } },
    tailoredResume: {
      type: "string",
      description:
        "A complete ATS-friendly resume as plain text: Summary, Skills, Experience (bulleted with quantified impact), Education, Projects (optional). No markdown fences."
    }
  },
  required: ["readinessScore", "strengths", "improvements", "missingKeywords", "tailoredResume"]
};



/**
 * Generates feedback for a resume based on a job description.
 * @param {string} resumeText - The plain text of the user's resume.
 * @param {string} jobDescription - The plain text of the target job description.
 * @returns {Promise<object>} - A promise that resolves to a JSON object with feedback.
 */
async function generateResumeFeedback(resumeText, jobDescription) {
  // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema
    }
  });

  // const prompt = `
  //   You are an expert career coach and resume reviewer for the tech industry, specializing in helping junior developers.
  //   Your task is to analyze the provided resume in the context of the target job description.

  //   **Resume Text:**
  //   ${resumeText}

  //   **Target Job Description:**
  //   ${jobDescription}

  //   **Instructions:**
  //   Provide structured feedback in a JSON format. The JSON object must include the following keys:
  //   1. "readinessScore": An integer between 0 and 100 representing how well the resume matches the job description.
  //   2. "strengths": An array of strings, with each string highlighting a specific strength or well-matched skill.
  //   3. "improvements": An array of objects, where each object has two keys: "area" (e.g., "Experience Section", "Skills List") and "suggestion" (a specific, actionable suggestion for improvement).
  //   4. "missingKeywords": An array of important keywords or technologies from the job description that are missing from the resume.

  //   Do not include any introductory text or explanations outside of the JSON object itself.
  // `;

  const prompt = `
You are an expert career coach for junior developers.
Analyze the candidate's resume versus the target job description and return ONLY JSON that matches the provided schema.

CONTEXT
- Resume (verbatim): 
${resumeText}

- Job Description (verbatim):
${jobDescription}

OUTPUT REQUIREMENTS
- readinessScore: integer 0..100 representing match quality.
- strengths: concrete strengths already present in the resume relative to the job.
- improvements: array of { area, suggestion } with specific, actionable edits (rewrite bullets, add metrics, reorder sections, etc.).
- missingKeywords: important job keywords not present in the resume (include only if truly relevant to the candidate's background).
- tailoredResume: a COMPLETE, ATS-friendly resume **as plain text** (no markdown/code fences). 
  * Reuse only factual information from the user's resume; do NOT invent education/employment.
  * It's okay to rephrase bullets, tighten language, and integrate relevant keywords if consistent with the resume.
  * Keep to ~1 page feel; concise summary; Skills grouped; Experience bullets with strong verbs + quantified impact where possible.
  * Maintain consistent tense and formatting; avoid emojis, tables, or styling.
  * If contact info is missing, use neutral placeholders (e.g., "Full Name", "City, Country", "email@example.com").
`;


  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the text to ensure it's valid JSON
    // const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    // return JSON.parse(jsonString);
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating feedback from Gemini:", error);
    throw new Error("Failed to get feedback from AI service.");
  }
}

module.exports = { generateResumeFeedback };
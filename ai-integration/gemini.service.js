// ai-integration/gemini.service.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates feedback for a resume based on a job description.
 * @param {string} resumeText - The plain text of the user's resume.
 * @param {string} jobDescription - The plain text of the target job description.
 * @returns {Promise<object>} - A promise that resolves to a JSON object with feedback.
 */
async function generateResumeFeedback(resumeText, jobDescription) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert career coach and resume reviewer for the tech industry, specializing in helping junior developers.
    Your task is to analyze the provided resume in the context of the target job description.

    **Resume Text:**
    ${resumeText}

    **Target Job Description:**
    ${jobDescription}

    **Instructions:**
    Provide structured feedback in a JSON format. The JSON object must include the following keys:
    1. "readinessScore": An integer between 0 and 100 representing how well the resume matches the job description.
    2. "strengths": An array of strings, with each string highlighting a specific strength or well-matched skill.
    3. "improvements": An array of objects, where each object has two keys: "area" (e.g., "Experience Section", "Skills List") and "suggestion" (a specific, actionable suggestion for improvement).
    4. "missingKeywords": An array of important keywords or technologies from the job description that are missing from the resume.

    Do not include any introductory text or explanations outside of the JSON object itself.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the text to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating feedback from Gemini:", error);
    throw new Error("Failed to get feedback from AI service.");
  }
}

module.exports = { generateResumeFeedback };
import groq from "../../config/groq.js";
import { analysisPrompt } from "../../utils/promptTemplates.js";

export const analyzeProblem = async (title, body) => {
  try {
    const prompt = analysisPrompt(title, body);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an expert software engineer who analyzes technical problems."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 100
    });

    let result;

    try {
      result = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      console.error("JSON Parse Error:", err.message);
      return {
        difficulty: "Medium",
        tags: ["general"]
      };
    }

    // Validation
    const validDifficulties = ["Easy", "Medium", "Hard"];

    if (!validDifficulties.includes(result.difficulty)) {
      result.difficulty = "Medium";
    }

    if (!Array.isArray(result.tags) || result.tags.length === 0) {
      result.tags = ["general"];
    }

    return result;

  } catch (error) {
    console.error("Groq AI Error:", error.message);
    return {
      difficulty: "Medium",
      tags: ["general"]
    };
  }
};
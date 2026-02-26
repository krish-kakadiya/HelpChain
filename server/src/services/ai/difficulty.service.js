import groq from "../../config/groq.js";
import { difficultyPrompt } from "../../utils/promptTemplates.js";

export const analyzeDifficulty = async (title, body, tags) => {
  try {
    const prompt = difficultyPrompt(title, body, tags);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a senior competitive programmer who classifies coding problems."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });

    const difficulty = response.choices[0].message.content.trim();

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return "Medium";
    }

    return difficulty;

  } catch (error) {
    console.error("Groq AI Error:", error.message);
    return "Medium";
  }
};
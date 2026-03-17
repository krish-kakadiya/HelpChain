export const analysisPrompt = (title, body) => {
  return `
You are a senior software engineer and system architect.

Your task is to analyze the following problem and return:

1. Difficulty level (Easy / Medium / Hard)
2. Relevant tags (3 to 6 tags)

--------------------------------------------------

Problem Title:
${title}

Problem Description:
${body}

--------------------------------------------------

Difficulty Guidelines:

EASY:
- Basic issues, simple fixes
- Common beginner-level problems
- Minimal debugging or logic

MEDIUM:
- Requires debugging, multiple concepts
- Needs understanding of tools, frameworks, or logic
- Some experience required

HARD:
- Complex system issues, architecture problems
- Performance, scalability, or deep debugging
- Requires strong experience

--------------------------------------------------

Tag Guidelines:

Generate tags based on:
- Technology (React, Node.js, MongoDB, etc.)
- Type (Bug, Performance, Authentication, API, UI, etc.)
- Concept (Async, State Management, Database, etc.)

--------------------------------------------------

Important Rules:
- Return ONLY valid JSON
- Do NOT explain anything
- Format must be EXACTLY:

{
  "difficulty": "Easy/Medium/Hard",
  "tags": ["tag1", "tag2", "tag3"]
}

If unsure, choose a higher difficulty.

Final Answer:
`;
};
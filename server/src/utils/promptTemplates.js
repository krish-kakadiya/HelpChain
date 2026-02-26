export const difficultyPrompt = (title, body, tags) => {
  return `
You are a senior competitive programmer and problem setter.

Your task is to classify the following coding problem into EXACTLY ONE difficulty level:
Easy, Medium, or Hard.

Evaluate the difficulty based on:

1. Concept complexity
2. Required data structures
3. Required algorithms
4. Edge case handling
5. Optimization level required
6. Expected experience level of solver

--------------------------------------------------

Problem Title:
${title}

Problem Description:
${body}

Tags:
${tags?.join(", ")}

--------------------------------------------------

Difficulty Guidelines:

EASY:
- Basic loops, conditionals, simple math
- No complex data structures
- Can be solved by beginners
- Time complexity not critical

MEDIUM:
- Requires standard algorithms (sorting, binary search, recursion, hashing, stack, queue)
- Some edge case thinking needed
- Moderate problem-solving skill required
- Basic optimization awareness required

HARD:
- Advanced algorithms (DP, Graphs, Greedy, Segment Tree, Backtracking, Advanced Recursion)
- Requires optimization or deep logic
- Multiple edge cases
- High algorithmic maturity required

--------------------------------------------------

Important Rules:
- Do NOT explain your reasoning.
- Do NOT return a sentence.
- Return ONLY one word.
- Output must be exactly one of:
Easy
Medium
Hard

If uncertain, choose the more difficult level.

Final Answer:
`;
};
import Problem from "../models/problem.model.js";
import { analyzeDifficulty } from "./ai/difficulty.service.js";

export const createProblemService = async (problemData, userId) => {

  const difficulty = await analyzeDifficulty(
    problemData.title,
    problemData.body,
    problemData.tags
  );

  const problem = await Problem.create({
    ...problemData,
    user: userId,
    difficulty,
  });

  return problem;
};

export const myProblemsService = async (userId) => {
    const myProblem = await Problem.find({user: userId})
    return myProblem;
} 
import Problem from "../models/problem.model.js";
import { analyzeProblem } from "./ai/difficulty.service.js";
import Answer from "../models/answer.model.js";

export const createProblemService = async (problemData, userId) => {

  const { difficulty, tags } = await analyzeProblem(
    problemData.title,
    problemData.body,
  );

  const problem = await Problem.create({
    ...problemData,
    user: userId,
    difficulty,
    tags,
  });

  return problem;
};

export const myProblemsService = async (userId) => {
  const problems = await Problem.find({ user: userId })
    .populate("user", "username")
    .lean(); // convert to plain JS object

  // Add solutions count
  const problemsWithSolutions = await Promise.all(
    problems.map(async (problem) => {
      const solutionsCount = await Answer.countDocuments({
        question: problem._id,
      });

      return {
        ...problem,
        solutions: solutionsCount,
      };
    })
  );

  return problemsWithSolutions;
};

export const allProblemsService = async (currentUserId) => {
  const problems = await Problem.find({
    user: { $ne: currentUserId },
  })
    .populate("user", "username")
    .lean(); // convert to plain JS object
  // Add solutions count
  const problemsWithSolutions = await Promise.all(
    problems.map(async (problem) => {
      const solutionsCount = await Answer.countDocuments({
        question: problem._id,
      });
      return {
        ...problem,
        solutions: solutionsCount,
      };
    })
  );
  return problemsWithSolutions;
};


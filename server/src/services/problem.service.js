import Problem from "../models/problem.model.js";
import Profile from "../models/profile.model.js";
import { analyzeProblem } from "./ai/difficulty.service.js";
import Answer from "../models/answer.model.js";
import { awardPoints, checkAndAssignBadges } from "../utils/rewards.js";

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

  // Reward points for creating a question
  await awardPoints(userId, 5);
  await checkAndAssignBadges(userId);

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
  // 1. Get user profile
  const profile = await Profile.findOne({ user: currentUserId }).lean();

  if (!profile) {
    throw new Error("Profile not found");
  }

  // 2. Merge interests
  const userInterests = [
    ...(profile.technologies || []),
    ...(profile.techStacks || []),
  ];

  // 3. Find matching problems
  let problems = await Problem.find({
    user: { $ne: currentUserId },
    tags: { $in: userInterests },
  })
    .populate("user", "username")
    .lean();

  // 4. Fallback (if no match → show trending)
  if (problems.length === 0) {
    problems = await Problem.find({
      user: { $ne: currentUserId },
    })
      .sort({ views: -1 })
      .limit(10)
      .populate("user", "username")
      .lean();
  }

  // 5. Rank problems (based on tag match count)
  const scoredProblems = problems.map((problem) => {
    const matchCount = problem.tags.filter((tag) =>
      userInterests.includes(tag)
    ).length;

    return {
      ...problem,
      score: matchCount,
    };
  });

  // Sort by best match
  scoredProblems.sort((a, b) => b.score - a.score);

  // 6. Add solutions count
  const finalProblems = await Promise.all(
    scoredProblems.map(async (problem) => {
      const solutionsCount = await Answer.countDocuments({
        question: problem._id,
      });

      return {
        ...problem,
        solutions: solutionsCount,
      };
    })
  );

  return finalProblems;
};

// export const allProblemsService = async (currentUserId) => {
// };
import Answer from "../models/answer.model.js";
import Problem from "../models/problem.model.js";
import { awardPoints, checkAndAssignBadges } from "../utils/rewards.js";

export const createAnswerService = async (questionId, body, userId) => {
  const answer = await Answer.create({
    body,
    question: questionId,
    user: userId,
  });

  await awardPoints(userId, 10);
  await checkAndAssignBadges(userId);

  return answer.populate("user", "username");
};

export const voteAnswerService = async (answerId, userId, value) => {
  const answer = await Answer.findById(answerId);

  if (!answer) {
    throw new Error("Answer not found");
  }

  // ❌ prevent self vote
  if (answer.user.toString() === userId) {
    throw new Error("You can't vote your own answer");
  }

  const existingVote = answer.voters.find(
    v => v.user.toString() === userId
  );

  if (existingVote) {
    if (existingVote.value === value) {
      // 🔁 remove vote
      answer.votes -= value;

      answer.voters = answer.voters.filter(
        v => v.user.toString() !== userId
      );

      const correction = value === 1 ? -2 : 1;
      await awardPoints(answer.user, correction);
      await checkAndAssignBadges(answer.user);
    } else {
      // 🔄 change vote
      answer.votes += value * 2;
      existingVote.value = value;

      const change = value === 1 ? 3 : -3;
      await awardPoints(answer.user, change);
      await checkAndAssignBadges(answer.user);
    }
  } else {
    // ➕ new vote
    answer.votes += value;
    answer.voters.push({ user: userId, value });

    const addition = value === 1 ? 2 : -1;
    await awardPoints(answer.user, addition);
    await checkAndAssignBadges(answer.user);
  }

  await answer.save();

  return answer.votes;
};

export const acceptAnswerService = async (answerId, userId) => {
  const answer = await Answer.findById(answerId);

  if (!answer) {
    throw new Error("Answer not found");
  }

  const problem = await Problem.findById(answer.question);

  if (!problem) {
    throw new Error("Problem not found");
  }

  // ❌ Only owner can accept
  if (problem.user.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  // 🔁 Remove previous accepted answer
  if (problem.acceptedAnswer) {
    const prevAnswer = await Answer.findByIdAndUpdate(problem.acceptedAnswer, {
      isAccepted: false,
    });
    if (prevAnswer) {
      await awardPoints(prevAnswer.user, -15);
      await checkAndAssignBadges(prevAnswer.user);
    }
  }

  // ✅ Set new accepted answer
  answer.isAccepted = true;
  await answer.save();

  await awardPoints(answer.user, 15);
  await checkAndAssignBadges(answer.user);

  // ✅ Update problem
  problem.acceptedAnswer = answer._id;
  await problem.save();

  return answer;
};
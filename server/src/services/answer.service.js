import Answer from "../models/answer.model.js";
import Problem from "../models/problem.model.js";
import { awardPoints, checkAndAssignBadges } from "../utils/rewards.js";
import { createNotificationService } from "./notification.service.js";

// ─────────────────────────────────────────────
// CREATE ANSWER
// ─────────────────────────────────────────────
export const createAnswerService = async (questionId, body, userId) => {
  const answer = await Answer.create({
    body,
    question: questionId,
    user: userId,
  });

  await awardPoints(userId, 10);
  await checkAndAssignBadges(userId);

  const problem = await Problem.findById(questionId).select("user title");
  if (problem) {
    await createNotificationService({
      recipientId: problem.user,
      actorId: userId,
      type: "solution",
      problemId: questionId,
      answerId: answer._id,
    });
  }

  return answer.populate("user", "username");
};

// ─────────────────────────────────────────────
// VOTE ANSWER
// ─────────────────────────────────────────────
export const voteAnswerService = async (answerId, userId, value) => {
  const answer = await Answer.findById(answerId);

  if (!answer) throw new Error("Answer not found");

  if (answer.user.toString() === userId) throw new Error("You can't vote your own answer");

  const existingVote = answer.voters.find((v) => v.user.toString() === userId);

  if (existingVote) {
    if (existingVote.value === value) {
      answer.votes -= value;
      answer.voters = answer.voters.filter((v) => v.user.toString() !== userId);
      const correction = value === 1 ? -2 : 1;
      await awardPoints(answer.user, correction);
      await checkAndAssignBadges(answer.user);
    } else {
      answer.votes += value * 2;
      existingVote.value = value;
      const change = value === 1 ? 3 : -3;
      await awardPoints(answer.user, change);
      await checkAndAssignBadges(answer.user);
    }
  } else {
    answer.votes += value;
    answer.voters.push({ user: userId, value });
    const addition = value === 1 ? 2 : -1;
    await awardPoints(answer.user, addition);
    await checkAndAssignBadges(answer.user);

    if (value === 1) {
      await createNotificationService({
        recipientId: answer.user,
        actorId: userId,
        type: "reaction",
        problemId: answer.question,
        answerId: answer._id,
      });
    }
  }

  await answer.save();
  return answer.votes;
};

// ─────────────────────────────────────────────
// ACCEPT ANSWER
// ─────────────────────────────────────────────
export const acceptAnswerService = async (answerId, userId) => {
  const answer = await Answer.findById(answerId);
  if (!answer) throw new Error("Answer not found");

  const problem = await Problem.findById(answer.question);
  if (!problem) throw new Error("Problem not found");

  if (problem.user.toString() !== userId) throw new Error("Unauthorized");

  if (problem.acceptedAnswer) {
    const prevAnswer = await Answer.findByIdAndUpdate(problem.acceptedAnswer, {
      isAccepted: false,
    });
    if (prevAnswer) {
      await awardPoints(prevAnswer.user, -15);
      await checkAndAssignBadges(prevAnswer.user);
    }
  }

  answer.isAccepted = true;
  await answer.save();

  await awardPoints(answer.user, 15);
  await checkAndAssignBadges(answer.user);

  problem.acceptedAnswer = answer._id;
  await problem.save();

  return answer;
};

// ─────────────────────────────────────────────
// GET MY ANSWERS  ← new
// ─────────────────────────────────────────────
export const getMyAnswersService = async (userId) => {
  const answers = await Answer.find({ user: userId })
    .populate("question", "title tags createdAt")
    .sort({ createdAt: -1 });

  return answers.map((a) => ({
    ...a.toObject(),
    userVoted: a.voters?.some((v) => v.user.toString() === userId) ?? false,
  }));
};
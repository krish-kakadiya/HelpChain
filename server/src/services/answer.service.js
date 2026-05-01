import Answer from "../models/answer.model.js";
import Problem from "../models/problem.model.js";
import { awardPoints, checkAndAssignBadges, incrementTagAcceptedCount } from "../utils/rewards.js";
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

  const problem = await Problem.findById(questionId).select("user title tags");
  
  await awardPoints(userId, 2, problem?.tags || []);
  await checkAndAssignBadges(userId);

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

  const problem = await Problem.findById(answer.question).select("tags");
  const existingVote = answer.voters.find((v) => v.user.toString() === userId);

  if (existingVote) {
    if (existingVote.value === value) {
      answer.votes -= value;
      answer.voters = answer.voters.filter((v) => v.user.toString() !== userId);
      const correction = value === 1 ? -10 : 2;
      await awardPoints(answer.user, correction, problem?.tags || []);
      await checkAndAssignBadges(answer.user);
    } else {
      answer.votes += value * 2;
      existingVote.value = value;
      const change = value === 1 ? 12 : -12;
      await awardPoints(answer.user, change, problem?.tags || []);
      await checkAndAssignBadges(answer.user);
    }
  } else {
    answer.votes += value;
    answer.voters.push({ user: userId, value });
    const addition = value === 1 ? 10 : -2;
    await awardPoints(answer.user, addition, problem?.tags || []);
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
      await awardPoints(prevAnswer.user, -15, problem?.tags || []);
      await checkAndAssignBadges(prevAnswer.user);
      await incrementTagAcceptedCount(prevAnswer.user, problem?.tags || [], -1);
    }
  }

  answer.isAccepted = true;
  await answer.save();

  await awardPoints(answer.user, 15, problem?.tags || []);
  await checkAndAssignBadges(answer.user);
  await incrementTagAcceptedCount(answer.user, problem?.tags || [], 1);

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
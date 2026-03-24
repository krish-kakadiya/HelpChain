import Answer from "../models/answer.model.js";
import Problem from "../models/problem.model.js";

export const createAnswerService = async (questionId, body, userId) => {
  const answer = await Answer.create({
    body,
    question: questionId,
    user: userId,
  });

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
    } else {
      // 🔄 change vote
      answer.votes += value * 2;
      existingVote.value = value;
    }
  } else {
    // ➕ new vote
    answer.votes += value;
    answer.voters.push({ user: userId, value });
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
    await Answer.findByIdAndUpdate(problem.acceptedAnswer, {
      isAccepted: false,
    });
  }

  // ✅ Set new accepted answer
  answer.isAccepted = true;
  await answer.save();

  // ✅ Update problem
  problem.acceptedAnswer = answer._id;
  await problem.save();

  return answer;
};
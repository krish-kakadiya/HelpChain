import Answer from "../models/answer.model.js";

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
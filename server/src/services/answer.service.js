import Answer from "../models/answer.model.js";

export const createAnswerService = async (questionId, body, userId) => {
  const answer = await Answer.create({
    body,
    question: questionId,
    user: userId,
  });

  return answer.populate("user", "username");
};
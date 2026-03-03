import { createAnswerService } from "../services/answer.service.js";

export const createAnswer = async (req, res) => {
  try {
    const { questionId, body } = req.body;
    const answer = await createAnswerService(questionId, body, req.user.userId);
    res.status(201).json({
      success: true,
      data: answer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
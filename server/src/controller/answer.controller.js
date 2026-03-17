import { createAnswerService, voteAnswerService } from "../services/answer.service.js";

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

export const voteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const updatedVotes = await voteAnswerService(
      id,
      req.user.userId,
      value
    );

    res.json({
      success: true,
      votes: updatedVotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
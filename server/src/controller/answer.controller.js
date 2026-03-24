import { createAnswerService, voteAnswerService, acceptAnswerService } from "../services/answer.service.js";

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

export const acceptAnswer = async (req, res) => {
  try {
    const answer = await acceptAnswerService(
      req.params.id,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Answer accepted successfully",
      answer
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
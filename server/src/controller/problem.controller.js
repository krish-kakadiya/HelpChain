import { createProblemService , myProblemsService } from "../services/problem.service.js";

export const createProblem = async (req, res) => {
  try {
    const problem = await createProblemService(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Problem posted successfully",
      problem,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const myProblems = async (req,res) => {
  try{
    const myProblem = await myProblemsService(req.user.userId);
    res.status(200).json({
      status: 1,
      message: "This is Your Problems",
      myProblem
    })
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
}
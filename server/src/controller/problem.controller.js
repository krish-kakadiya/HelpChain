import { allProblemsService, createProblemService , myProblemsService } from "../services/problem.service.js";
import Problem from "../models/problem.model.js";
import Answer from "../models/answer.model.js";

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
    console.log("My Problems:", myProblem);
    res.status(200).json({
      success: true,
      message: "This is Your Problems",
      myProblem
    })
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
}

export const allProblems = async (req,res) => {
  try {
    const allProblems = await allProblemsService(req.user.userId);
    console.log("All Problems:", allProblems);
    res.status(200).json({
      success: true,
      message: "All Problems Fetched Successfully",
      allProblems
    })
  } catch (error) {
    console.error("Error fetching all problems:", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
}

export const getSingleProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate("user", "username");

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    console.log("Problem Details:", problem);
    const answers = await Answer.find({ question: problem._id })
      .populate("user", "username")
      .sort({ isAccepted: -1, votes: -1 });

    res.status(200).json({
      success: true,
      problem,
      answers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
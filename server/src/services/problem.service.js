    import Problem from "../models/problem.model.js";

    export const createProblemService = async (problemData, userId) => {
        const problem = await Problem.create({
            ...problemData,
            user: userId
        })
        return problem;
    }

export const myProblemsService = async (userId) => {
    const myProblem = await Problem.find({user: userId})
    return myProblem;
} 
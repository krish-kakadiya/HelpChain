import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createAnswer, voteAnswer, acceptAnswer } from "../controller/answer.controller.js";

const router = express.Router();


router.post("/",auth,createAnswer);
router.post("/:id/vote", auth, voteAnswer);
router.post("/:id/accept", auth, acceptAnswer);

export default router;
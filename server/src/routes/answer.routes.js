import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createAnswer, voteAnswer } from "../controller/answer.controller.js";

const router = express.Router();


router.post("/",auth,createAnswer);
router.post("/:id/vote", auth, voteAnswer);

export default router;
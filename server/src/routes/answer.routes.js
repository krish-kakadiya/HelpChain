import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createAnswer } from "../controller/answer.controller.js";

const router = express.Router();


router.post("/",auth,createAnswer);

export default router;
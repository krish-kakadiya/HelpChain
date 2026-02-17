import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
console.log("Environment Variables loaded:");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

export default app;

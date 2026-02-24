import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import profileRoutes from "./routes/profile.routes.js";
import problemRoutes from "./routes/problem.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/problem",problemRoutes);

export default app;

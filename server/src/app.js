import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import profileRoutes from "./routes/profile.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import answerRoutes from "./routes/answer.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/problem",problemRoutes);
app.use("/api/answer",answerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;

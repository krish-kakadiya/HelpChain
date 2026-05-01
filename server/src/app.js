import express from "express";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import profileRoutes from "./routes/profile.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import answerRoutes from "./routes/answer.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import expertConnectRoutes from "./routes/expertConnect.routes.js";
import ExpertSession from "./models/expert_session.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("join_session", (sessionId) => {
    socket.join(sessionId);
  });

  socket.on("send_message", async (data) => {
    try {
      const session = await ExpertSession.findById(data.sessionId);
      if (session) {
        const newMessage = {
          sender: data.senderId,
          text: data.text,
          createdAt: new Date()
        };
        session.messages.push(newMessage);
        await session.save();

        io.to(data.sessionId).emit("receive_message", newMessage);
      }
    } catch (err) {
      console.error("Socket error:", err);
    }
  });
});

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/problem",problemRoutes);
app.use("/api/answer",answerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/expert-connect", expertConnectRoutes);

export { app, server, io };

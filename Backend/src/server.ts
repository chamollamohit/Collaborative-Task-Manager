import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import { createServer } from "http";
import { socketService } from "./services/SocketService";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

// --- Global Middleware ---
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Task Manager API is running");
});

// Initialize Socket.io
socketService.init(httpServer);

// --- Start Server ---
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Routes
import gameChatRoutes from "./routes/gameChat.routes.js";
import studentRoutes from "./routes/students.js";
import levelRoutes from "./routes/levels.js";
import storyRoutes from "./routes/stories.js";
import helpRequestRoutes from "./routes/helpRequests.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);


app.use(express.json());


app.use("/images", express.static(path.join(__dirname, "images")));


app.use("/api/game-chat", gameChatRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/help-requests", helpRequestRoutes);


app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});


const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});



const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.io server is ready`);
});

import { detectLanguage, getSystemPromptByLanguage } from './_core/languageDetection.js';
import { OpenAI } from 'openai';
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
import serenaRoutes from "./routes/serena.routes.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// --- CORS Configuration ---
const ALLOWED_ORIGINS = [
  "http://localhost:3000", 
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
app.use('/api', serenaRoutes);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    // كشف اللغة
    const detectedLanguage = detectLanguage(message);
    const systemPrompt = getSystemPromptByLanguage(detectedLanguage);

    // استدعاء OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0]?.message?.content || 'Sorry, I could not get a response.';

    res.json({
      reply,
      success: true,
      detectedLanguage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});


app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});


const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS, // Use the same CORS origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle room joining
  socket.on("join-room", (data) => {
    const { roomId, playerId, playerName } = data;
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", { playerId, playerName });
  });

  // Handle room leaving
  socket.on("leave-room", (data) => {
    const { roomId, playerId } = data;
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
    socket.to(roomId).emit("user-left", { playerId });
  });

  // Handle sending messages
  socket.on("send-message", (data) => {
    const { roomId, message, sender, senderId } = data;
    console.log(`Message in room ${roomId} from ${sender}: ${message}`);
    socket.to(roomId).emit("new-message", { message, sender, senderId });
  });

  // Handle game start
  socket.on("start-game", (data) => {
    const { roomId, topic } = data;
    console.log(`Game started in room ${roomId} with topic: ${topic}`);
    io.to(roomId).emit("game-started", { topic });
  });

  // Handle game end
  socket.on("end-game", (data) => {
    const { roomId } = data;
    console.log(`Game ended in room ${roomId}`);
    io.to(roomId).emit("game-ended");
  });

  // Handle getting room info
  socket.on("get-room-info", (data) => {
    const { roomId } = data;
    // You can implement room info logic here
    socket.emit("room-info", { roomId, players: [] });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});



const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.io server is ready`);
});

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

// --- FIX CORS (To allow your Frontend) ---
const ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5173"];
app.use(
  cors({
    origin: ALLOWED_ORIGINS, 
    credentials: true,
  })
);



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

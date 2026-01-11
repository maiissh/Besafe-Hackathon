import express from "express";
import {
    getRandomTopic,
    startChat,
    sendImposterMessage,
    getGameResults
} from "../controllers/gameChat.controller.js";

const router = express.Router();

router.get("/topic", getRandomTopic);
router.post("/start", startChat);
router.post("/imposter-message", sendImposterMessage);
router.get("/results/:chatId", getGameResults);

export default router;

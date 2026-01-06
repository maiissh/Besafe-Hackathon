import express from "express";
import {
    getRandomTopic,
    startChat,
    sendImposterMessage
} from "../controllers/gameChat.controller.js";

const router = express.Router();

router.get("/topic", getRandomTopic);
router.post("/start", startChat);
router.post("/imposter-message", sendImposterMessage);

export default router;

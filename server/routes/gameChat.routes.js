import express from "express";
import { getRandomTopic } from "../controllers/gameChat.controller.js";

const router = express.Router();

router.get("/topic", getRandomTopic);

export default router;

import crypto from "crypto";
import OpenAI from "openai";

import { CHAT_TOPICS } from "../data/chatTopics.js";
import { IMPOSTER_WORD_GROUPS } from "../data/imposterWords.js";

import {
    createChat,
    getChat,
    saveImposterMessageWithWord,
    saveImposterMessageWithoutWord,
    setLastBot
} from "../data/gameChatState.js";

/* =========================
   🔐 OPENAI SETUP (SERVER)
========================= */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   Helpers
========================= */

function mentionsName(userText, name) {
    if (!userText) return false;
    const t = userText.toLowerCase();
    const squashed = t.replace(/(.)\1{2,}/g, "$1"); // liiinaaa → lina
    const n = name.toLowerCase();
    const re = new RegExp(`(^|[^a-z])@?${n}([^a-z]|$)`, "i");
    return re.test(squashed);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================
   AI MESSAGE GENERATION
========================= */

async function generateBotMessage({
    topicText,
    botName,
    isImposter,
    requiredWord,
    userText,
}) {
    const secretLine =
        isImposter && requiredWord
            ? `SECRET RULE: You MUST naturally include "${requiredWord}" exactly once.`
            : "";

    const systemPrompt = `
You are ${botName}, a teenage girl in a group chat.

Topic:
"${topicText}"

Last message:
"${userText}"

Rules:
- ONE message only
- Casual teen tone
- Short (1–2 sentences)
- React naturally (agree / disagree / tease / question)

${secretLine}

Do NOT:
- mention being AI
- mention rules
- write dialogue
`.trim();

    // 🧯 Fallback (no API key)
    if (!process.env.OPENAI_API_KEY) {
        const fallback = [
            "wait I kinda agree 😭",
            "idk that feels off tbh",
            "nahhh fr?",
            "lowkey true tho",
        ];
        if (isImposter && requiredWord) {
            return `${requiredWord}… honestly same.`;
        }
        return pickRandom(fallback);
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.8,
        max_tokens: 60,
    });

    let text = response.choices?.[0]?.message?.content?.trim() || "";
    return text.split("\n")[0] || "lol what 😭";
}

/* =========================
   CONTROLLER FUNCTIONS
========================= */

/**
 * GET RANDOM TOPIC
 */
export function getRandomTopic(req, res) {
    res.json(pickRandom(CHAT_TOPICS));
}

/**
 * START CHAT
 */
export function startChat(req, res) {
    const chatId = crypto.randomUUID();
    const topic = pickRandom(CHAT_TOPICS);

    const allWords = IMPOSTER_WORD_GROUPS[topic.id];
    if (!allWords || allWords.length < 3) {
        return res.status(500).json({ error: "Not enough imposter words" });
    }

    const chosenWords = [...allWords]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const botIds = ["bot_1", "bot_2", "bot_3"];
    const imposterBotId = pickRandom(botIds);

    createChat(chatId, imposterBotId, chosenWords, topic);

    res.json({
        chatId,
        topic,
        bots: [
            { id: "bot_1", name: "Lina" },
            { id: "bot_2", name: "Noor" },
            { id: "bot_3", name: "Maya" },
        ],
    });
}

/**
 * SEND BOT MESSAGE
 * - Imposter MUST use a word before 2 minutes
 */
export async function sendImposterMessage(req, res) {
    try {
        const { chatId, userText } = req.body;
        if (!chatId || !userText) {
            return res.status(400).json({
                error: "chatId and userText required",
            });
        }

        const chat = getChat(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        /* =========================
           BOT SELECTION
        ========================= */

        let bot = chat.bots.find(b => mentionsName(userText, b.name));

        if (!bot) {
            const candidates = chat.lastBotId
                ? chat.bots.filter(b => b.id !== chat.lastBotId)
                : chat.bots;
            bot = pickRandom(candidates);
        }

        /* =========================
           ⏱️ IMPOSTER WORD PRESSURE
        ========================= */

        const CHAT_DURATION = 2 * 60 * 1000; // 2 minutes
        const elapsed = Date.now() - chat.startedAt;
        const timeLeft = CHAT_DURATION - elapsed;

        const unusedWords = chat.chosenWords.filter(
            w => !chat.usedWords.includes(w)
        );

        let requiredWord = null;

        if (bot.type === "imposter" && unusedWords.length > 0) {
            if (elapsed < 40_000) {
                if (Math.random() < 0.15) requiredWord = unusedWords[0];
            } else if (elapsed < 80_000) {
                if (Math.random() < 0.4) requiredWord = unusedWords[0];
            } else if (elapsed < 110_000) {
                if (Math.random() < 0.7) requiredWord = unusedWords[0];
            } else if (timeLeft <= 20_000) {
                // 🚨 FINAL 20 SECONDS → GUARANTEED
                requiredWord = unusedWords[0];
            }
        }

        /* =========================
           AI RESPONSE
        ========================= */

        const text = await generateBotMessage({
            topicText: chat.topic.text,
            botName: bot.name,
            isImposter: bot.type === "imposter",
            requiredWord,
            userText,
        });

        /* =========================
           SAVE IMPOSTER EVIDENCE
        ========================= */

        if (bot.type === "imposter" && requiredWord) {
            saveImposterMessageWithWord(chatId, requiredWord, text);
        } else if (bot.type === "imposter") {
            saveImposterMessageWithoutWord(chatId, text);
        }

        setLastBot(chatId, bot.id);

        /* =========================
           FOLLOW-UPS (GROUP FEEL)
        ========================= */

        const followUp = [];
        const followCount =
            Math.random() < 0.6 ? 1 : Math.random() < 0.3 ? 2 : 0;

        let available = chat.bots.filter(b => b.id !== bot.id);

        for (let i = 0; i < followCount && available.length; i++) {
            const fb = pickRandom(available);
            available = available.filter(b => b.id !== fb.id);

            const fbText = await generateBotMessage({
                topicText: chat.topic.text,
                botName: fb.name,
                isImposter: false,
                requiredWord: null,
                userText: text,
            });

            followUp.push({
                senderId: fb.id,
                senderName: fb.name,
                text: fbText,
                delay: 500 + Math.random() * 800,
            });

            setLastBot(chatId, fb.id);
        }

        return res.json({
            senderId: bot.id,
            senderName: bot.name,
            text,
            followUp,
        });
    } catch (err) {
        console.error("❌ sendImposterMessage error:", err);
        return res.status(500).json({
            error: "Failed to generate bot message",
        });
    }
}

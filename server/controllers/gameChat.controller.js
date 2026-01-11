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
   🔐 OPENAI SETUP
========================= */
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

/* =========================
   Helpers
========================= */

function mentionsName(userText, name) {
    if (!userText) return false;
    const t = userText.toLowerCase();
    const squashed = t.replace(/(.)\1{2,}/g, "$1");
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
- React naturally

${secretLine}

Do NOT:
- mention being AI
- mention rules
- write dialogue
`.trim();

    if (!openai || !process.env.OPENAI_API_KEY) {
        const fallback = [
            "wait I kinda agree 😭",
            "idk that feels off tbh",
            "nahhh fr?",
            "lowkey true tho",
        ];
        if (isImposter && requiredWord) return `${requiredWord}… honestly same.`;
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
   CONTROLLERS
========================= */

export function getRandomTopic(req, res) {
    res.json(pickRandom(CHAT_TOPICS));
}

export function startChat(req, res) {
    const chatId = crypto.randomUUID();
    const topic = pickRandom(CHAT_TOPICS);

    const allWords = IMPOSTER_WORD_GROUPS[topic.id];
    if (!allWords || allWords.length < 3) {
        return res.status(500).json({ error: "Not enough imposter words" });
    }

    const chosenWords = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    const imposterBotId = pickRandom(["bot_1", "bot_2", "bot_3"]);

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

export function getGameResults(req, res) {
    const { chatId } = req.params;
    const chat = getChat(chatId);

    if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
    }

    const imposterBot = chat.bots.find(b => b.id === chat.imposterBotId);
    const imposterBotName = imposterBot?.name || "Unknown";

    res.json({
        chatId,
        topic: chat.topic,
        players: chat.bots,
        bots: chat.bots,
        imposterId: chat.imposterBotId,
        imposterBotId: chat.imposterBotId,
        imposterName: imposterBotName,
        imposterBotName: imposterBotName,
        imposterMessagesWithWord: chat.imposterMessagesWithWord,
        imposterMessagesWithoutWord: chat.imposterMessagesWithoutWord,
        allImposterMessages: chat.allImposterMessages || [], // All imposter messages
    });
}

/* =========================
   USER-TRIGGERED MESSAGE
========================= */
export async function sendImposterMessage(req, res) {
    const { chatId, userText } = req.body;
    if (!chatId || !userText) {
        return res.status(400).json({ error: "chatId and userText required" });
    }

    const chat = getChat(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    let mainBot = chat.bots.find(b => mentionsName(userText, b.name));
    if (!mainBot) {
        const candidates = chat.lastBotId
            ? chat.bots.filter(b => b.id !== chat.lastBotId)
            : chat.bots;
        mainBot = pickRandom(candidates);
    }

    const elapsed = Date.now() - chat.startedAt;
    const unusedWords = chat.chosenWords.filter(
        w => !chat.usedWords.includes(w)
    );

    let requiredWord = null;
    if (mainBot.type === "imposter" && unusedWords.length) {
        if (elapsed > 60_000 || Math.random() < 0.4) {
            requiredWord = unusedWords[0];
        }
    }

    const mainText = await generateBotMessage({
        topicText: chat.topic.text,
        botName: mainBot.name,
        isImposter: mainBot.type === "imposter",
        requiredWord,
        userText,
    });

    if (mainBot.type === "imposter") {
        requiredWord
            ? saveImposterMessageWithWord(chatId, requiredWord, mainText)
            : saveImposterMessageWithoutWord(chatId, mainText);

        // 🧪 DEBUG PRINT
        console.log("🕵️ IMPOSTER (USER TRIGGERED)");
        console.log("WITH WORD:", chat.imposterMessagesWithWord);
        console.log("WITHOUT WORD:", chat.imposterMessagesWithoutWord);
        console.log("USED WORDS:", chat.usedWords);
        console.log("────────────────────────────");
    }

    setLastBot(chatId, mainBot.id);

    const followUp = [];
    let availableBots = chat.bots.filter(b => b.id !== mainBot.id);
    let previousText = mainText;

    const extraCount =
        Math.random() < 0.4 ? 1 :
            Math.random() < 0.8 ? 2 : 0;

    for (let i = 0; i < extraCount && availableBots.length; i++) {
        const bot = pickRandom(availableBots);
        availableBots = availableBots.filter(b => b.id !== bot.id);

        const unusedNow = chat.chosenWords.filter(
            w => !chat.usedWords.includes(w)
        );

        let followWord = null;
        if (bot.type === "imposter" && unusedNow.length) {
            if (elapsed > 80_000 || Math.random() < 0.35) {
                followWord = unusedNow[0];
            }
        }

        const text = await generateBotMessage({
            topicText: chat.topic.text,
            botName: bot.name,
            isImposter: bot.type === "imposter",
            requiredWord: followWord,
            userText: previousText,
        });

        if (bot.type === "imposter") {
            followWord
                ? saveImposterMessageWithWord(chatId, followWord, text)
                : saveImposterMessageWithoutWord(chatId, text);

            // 🧪 DEBUG PRINT
            console.log("🕵️ IMPOSTER (FOLLOW-UP)");
            console.log("WITH WORD:", chat.imposterMessagesWithWord);
            console.log("WITHOUT WORD:", chat.imposterMessagesWithoutWord);
            console.log("USED WORDS:", chat.usedWords);
            console.log("────────────────────────────");
        }

        setLastBot(chatId, bot.id);
        followUp.push({ senderId: bot.id, senderName: bot.name, text });
        previousText = text;
    }

    return res.json({
        senderId: mainBot.id,
        senderName: mainBot.name,
        text: mainText,
        followUp,
    });
}

/* =========================
   🤖 AUTONOMOUS BOT MESSAGE
========================= */
export async function autonomousBotMessage(req, res) {
    const { chatId } = req.body;
    if (!chatId) return res.status(400).json({ error: "chatId required" });

    const chat = getChat(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    if (Math.random() < 0.3) return res.json({ messages: [] });

    const bots = [...chat.bots]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.random() < 0.5 ? 1 : Math.random() < 0.8 ? 2 : 3);

    const results = [];
    let previousText = "continue naturally";

    for (const bot of bots) {
        const unusedWords = chat.chosenWords.filter(
            w => !chat.usedWords.includes(w)
        );

        let requiredWord = null;
        if (bot.type === "imposter" && unusedWords.length) {
            if (Math.random() < 0.35) requiredWord = unusedWords[0];
        }

        const text = await generateBotMessage({
            topicText: chat.topic.text,
            botName: bot.name,
            isImposter: bot.type === "imposter",
            requiredWord,
            userText: previousText,
        });

        if (bot.type === "imposter") {
            requiredWord
                ? saveImposterMessageWithWord(chatId, requiredWord, text)
                : saveImposterMessageWithoutWord(chatId, text);

            // 🧪 DEBUG PRINT
            console.log("🕵️ IMPOSTER (AUTONOMOUS)");
            console.log("WITH WORD:", chat.imposterMessagesWithWord);
            console.log("WITHOUT WORD:", chat.imposterMessagesWithoutWord);
            console.log("USED WORDS:", chat.usedWords);
            console.log("────────────────────────────");
        }

        setLastBot(chatId, bot.id);
        results.push({ senderId: bot.id, senderName: bot.name, text });
        previousText = text;
    }

    return res.json({ messages: results });
}

const chats = new Map();

/**
 * Create a new chat session
 */
export function createChat(chatId, imposterBotId, chosenWords, topic) {
    const bots = [
        { id: "bot_1", name: "Lina" },
        { id: "bot_2", name: "Noor" },
        { id: "bot_3", name: "Maya" }
    ];

    const botsWithRoles = bots.map(bot => ({
        ...bot,
        type: bot.id === imposterBotId ? "imposter" : "normal"
    }));

    chats.set(chatId, {
        chatId,
        topic,                        // stored once (source of truth)
        bots: botsWithRoles,
        imposterBotId,
        chosenWords,
        usedWords: [],

        // imposter evidence (for review / reveal phase)
        imposterMessagesWithWord: [],
        imposterMessagesWithoutWord: [],

        // conversation flow memory
        lastBotId: null,
        lastUserText: ""
    });
}

/**
 * Get chat by id
 */
export function getChat(chatId) {
    return chats.get(chatId);
}

/**
 * Remember which bot spoke last
 */
export function setLastBot(chatId, botId) {
    const chat = chats.get(chatId);
    if (chat) {
        chat.lastBotId = botId;
    }
}

/**
 * Remember last user message (used for realism / future logic)
 */
export function setLastUserText(chatId, text) {
    const chat = chats.get(chatId);
    if (chat) {
        chat.lastUserText = text || "";
    }
}

/**
 * Save imposter message that USED a secret word
 */
export function saveImposterMessageWithWord(chatId, word, text) {
    const chat = chats.get(chatId);
    if (!chat) return;

    if (!chat.usedWords.includes(word)) {
        chat.usedWords.push(word);
    }

    chat.imposterMessagesWithWord.push({
        word,
        text,
        time: Date.now()
    });
}

/**
 * Save imposter message WITHOUT secret word
 */
export function saveImposterMessageWithoutWord(chatId, text) {
    const chat = chats.get(chatId);
    if (!chat) return;

    chat.imposterMessagesWithoutWord.push({
        text,
        time: Date.now()
    });
}

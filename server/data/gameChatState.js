const chats = new Map();

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
        topic,
        bots: botsWithRoles,
        imposterBotId,
        chosenWords,
        usedWords: [],
        imposterMessagesWithWord: [],
        imposterMessagesWithoutWord: [],
        allImposterMessages: [], // Store ALL imposter messages (both with and without word)
        lastBotId: null,
        startedAt: Date.now() // ⏱️ REQUIRED
    });
}

export function getChat(chatId) {
    return chats.get(chatId);
}

export function setLastBot(chatId, botId) {
    const chat = chats.get(chatId);
    if (chat) chat.lastBotId = botId;
}

export function saveImposterMessageWithWord(chatId, word, text) {
    const chat = chats.get(chatId);
    if (!chat) return;

    if (!chat.usedWords.includes(word)) {
        chat.usedWords.push(word);
    }

    const messageObj = {
        word,
        text,
        time: Date.now()
    };

    chat.imposterMessagesWithWord.push(messageObj);
    // Also save to allImposterMessages
    chat.allImposterMessages.push({
        ...messageObj,
        hasWord: true
    });
}

export function saveImposterMessageWithoutWord(chatId, text) {
    const chat = chats.get(chatId);
    if (!chat) return;

    const messageObj = {
        text,
        time: Date.now()
    };

    chat.imposterMessagesWithoutWord.push(messageObj);
    // Also save to allImposterMessages
    chat.allImposterMessages.push({
        ...messageObj,
        hasWord: false
    });
}

export const gameChatState = {
    topic: null,

    bots: [
        {
            id: "bot-1",
            name: "Bot A",
            role: "normal",
            messages: []
        },
        {
            id: "bot-2",
            name: "Bot B",
            role: "normal",
            messages: []
        },
        {
            id: "bot-3",
            name: "Bot C",
            role: "normal",
            messages: []
        }
    ],

    imposterId: null,        // 👈 who is the imposter
    imposterMessages: [],   // 👈 saved for later

    startedAt: null
};

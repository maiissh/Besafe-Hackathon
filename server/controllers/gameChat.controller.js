import { CHAT_TOPICS } from "../data/chatTopics.js";

export function getRandomTopic(req, res) {
    const randomIndex = Math.floor(Math.random() * CHAT_TOPICS.length);
    const topic = CHAT_TOPICS[randomIndex];

    res.json(topic);
}

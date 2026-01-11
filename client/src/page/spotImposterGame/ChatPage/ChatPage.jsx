import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatHeader from "../../../components/Header/ChatHeader";
import api from "../../../services/api";
import "./ChatPage.css";

/* ---------------- Helpers ---------------- */

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const typingDelay = (text = "") =>
    Math.min(1500, 400 + text.length * 20 + Math.random() * 300);

/* ---------------- Component ---------------- */

export default function ChatPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const topic = location.state?.topic;
    const points = location.state?.points || 0;
    const chatId = location.state?.chatId;

    // ✅ messages are READY on first render
    const [messages, setMessages] = useState(
        location.state?.initialMessages || []
    );
    const [input, setInput] = useState("");

    const messagesEndRef = useRef(null);
    const TOTAL_GAME_TIME = 120; // 2 minutes in seconds
    const [timeLeft, setTimeLeft] = useState(TOTAL_GAME_TIME);

    /* ---------------- GUARD ---------------- */

    useEffect(() => {
        if (!location.state || !topic || !chatId) {
            navigate("/");
        }
    }, [location.state, topic, chatId, navigate]);

    /* ---------------- TIMER & GAME END ---------------- */

    useEffect(() => {
        if (timeLeft <= 0) {
            // Game ended - get results and navigate to voting
            const endGame = async () => {
                try {
                    const res = await api.get(`/game-chat/results/${chatId}`);
                    const results = res.data;

                    // Save to localStorage as backup
                    localStorage.setItem("spotImposterResults", JSON.stringify(results));

                    // Navigate to voting page with results
                    navigate("/voting", { state: results });
                } catch (err) {
                    console.error("Failed to get game results:", err);
                    // Navigate anyway with basic data
                    navigate("/voting", {
                        state: {
                            topic,
                            chatId,
                            bots: [
                                { id: "bot_1", name: "Lina" },
                                { id: "bot_2", name: "Noor" },
                                { id: "bot_3", name: "Maya" },
                            ],
                        }
                    });
                }
            };

            endGame();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, chatId, topic, navigate]);

    /* ---------------- USER SEND ---------------- */

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userText = input.trim();
        setInput("");

        setMessages(prev => [...prev, { sender: "You", text: userText }]);

        try {
            const res = await api.post("/game-chat/imposter-message", {
                chatId,
                userText
            });

            const { senderName, text, followUp } = res.data;

            await sleep(typingDelay(text));
            setMessages(prev => [...prev, { sender: senderName, text }]);

            if (Array.isArray(followUp)) {
                for (const f of followUp) {
                    await sleep(typingDelay(f.text));
                    setMessages(prev => [
                        ...prev,
                        { sender: f.senderName, text: f.text }
                    ]);
                }
            }
        } catch (err) {
            console.error("Bot message failed:", err);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    /* ---------------- AUTO SCROLL ---------------- */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!topic) return null;

    /* ---------------- UI (UNCHANGED) ---------------- */

    return (
        <div className="chat-page">
            <ChatHeader topic={topic.text} points={points} />

            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender === "You" ? "own" : ""}`}
                        >
                            <span className="sender">{msg.sender}</span>
                            <div className="bubble">{msg.text}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage}>➤</button>
                </div>
            </div>
        </div>
    );
}

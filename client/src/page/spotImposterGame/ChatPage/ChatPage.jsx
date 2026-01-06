import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatHeader from "../../../components/Header/ChatHeader";
import api from "../../../services/api";
import "./ChatPage.css";

/* ---------------- Helpers ---------------- */

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const calcTypingDelay = (text = "") => {
    const base = 350;
    const perChar = 18;
    const jitter = Math.random() * 250;
    const max = 1200;
    return Math.min(max, base + text.length * perChar + jitter);
};

/* ---------------- Component ---------------- */

export default function ChatPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const topic = location.state?.topic;
    const points = location.state?.points || 0;
    const chatId = location.state?.chatId;

    const isReady = Boolean(topic && chatId);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const messagesEndRef = useRef(null);
    const hasStartedRef = useRef(false);

    /* ---------------- Guard ---------------- */

    useEffect(() => {
        if (!topic || !chatId) {
            navigate("/");
        }
    }, [topic, chatId, navigate]);

    /* ---------------- Bot Message ---------------- */

    const getBotMessage = useCallback(
        async (userText, { fast = false } = {}) => {
            try {
                const res = await api.post("/game-chat/imposter-message", {
                    chatId,
                    topicText: topic.text,
                    userText,
                });

                const data = res.data;

                await sleep(fast ? 500 : calcTypingDelay(data.text));

                setMessages((prev) => [
                    ...prev,
                    { sender: data.senderName, text: data.text },
                ]);

                if (Array.isArray(data.followUp)) {
                    for (const f of data.followUp) {
                        await sleep(calcTypingDelay(f.text));
                        setMessages((prev) => [
                            ...prev,
                            { sender: f.senderName, text: f.text },
                        ]);
                    }
                }
            } catch (err) {
                console.error("❌ Failed to get bot message:", err);
            }
        },
        [chatId, topic] // ✅ FIXED: depend on topic, not topic.text
    );

    /* ---------------- Start Chat Once ---------------- */

    useEffect(() => {
        if (!isReady || hasStartedRef.current) return;

        hasStartedRef.current = true;

        // ✅ async boundary → no synchronous setState inside effect
        setTimeout(() => {
            getBotMessage("start the discussion", { fast: true });
        }, 0);
    }, [isReady, getBotMessage]);

    /* ---------------- User Send ---------------- */

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userText = input.trim();

        setMessages((prev) => [
            ...prev,
            { sender: "You", text: userText },
        ]);

        setInput("");
        await getBotMessage(userText);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    /* ---------------- Auto Scroll ---------------- */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ---------------- Loading Screen ---------------- */

    if (!isReady) {
        return (
            <div className="chat-page">
                <ChatHeader topic={topic?.text || ""} points={points} />
                <div className="chat-container">
                    <div
                        className="chat-messages"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.6,
                        }}
                    >
                        Starting chat…
                    </div>
                </div>
            </div>
        );
    }

    /* ---------------- UI (UNCHANGED SHAPE) ---------------- */

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

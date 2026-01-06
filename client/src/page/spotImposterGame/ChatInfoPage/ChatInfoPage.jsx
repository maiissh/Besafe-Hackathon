import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatInfoPage.css";

export default function ChatInfoPage() {
    const navigate = useNavigate();
    const TOTAL_TIME = 10;

    const [countdown, setCountdown] = useState(TOTAL_TIME);
    const [topic, setTopic] = useState(null);
    const [chatId, setChatId] = useState(null); // ✅ MOVED HERE

    // START CHAT on server
    useEffect(() => {
        async function startGame() {
            try {
                const res = await fetch("http://localhost:5000/api/game-chat/start", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await res.json();
                // data = { chatId, topic, bots }

                setTopic(data.topic);
                setChatId(data.chatId);
            } catch (err) {
                console.error("Failed to start chat", err);
            }
        }

        startGame();
    }, []);

    // Countdown logic
    useEffect(() => {
        if (!topic || !chatId) return;

        if (countdown === 0) {
            navigate("/chat", {
                state: {
                    topic,
                    chatId
                }
            });
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((c) => c - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, navigate, topic, chatId]);

    // Loading guard
    if (!topic || !chatId) {
        return (
            <div className="chat-info-page">
                <div className="info-container">
                    <p>Loading game...</p>
                </div>
            </div>
        );
    }

    // UI
    return (
        <div className="chat-info-page">
            <div className="info-container">
                <h1 className="game-title">🎭 Spot Imposter Game</h1>
                <p className="subtitle">Read your role and topic carefully!</p>

                <div className="card topic-card">
                    <h3>Chat Topic</h3>
                    <p className="topic-text">{topic.text}</p>
                </div>

                <div className="card role-card">
                    <h3>Your Role</h3>
                    <p className="role innocent">✨ INNOCENT</p>
                    <p className="role-desc">
                        Find the imposter among your friends!
                    </p>
                </div>

                <div className="countdown-card">
                    <span>Game starting in</span>
                    <div className="countdown">{countdown}</div>
                </div>
            </div>
        </div>
    );
}

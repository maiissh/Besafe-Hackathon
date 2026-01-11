import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./ChatInfoPage.css";

export default function ChatInfoPage() {
    const navigate = useNavigate();
    const TOTAL_TIME = 10;

    const [countdown, setCountdown] = useState(TOTAL_TIME);
    const [topic, setTopic] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------------- START CHAT ON SERVER ---------------- */

    useEffect(() => {
        let isMounted = true;
        const timeoutId = setTimeout(() => {
            if (isMounted) {
                setError("Connection timeout. Please try again.");
                setLoading(false);
            }
        }, 10000); // 10 second timeout

        async function startGame() {
            try {
                const res = await api.post("/game-chat/start");
                if (isMounted) {
                    setTopic(res.data.topic);
                    setChatId(res.data.chatId);
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
            } catch (err) {
                console.error("Failed to start chat", err);
                if (isMounted) {
                    setError("Failed to start game. Please try again.");
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
            }
        }

        startGame();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

    /* ---------------- COUNTDOWN + WARMUP ---------------- */

    useEffect(() => {
        if (!topic || !chatId) return;

        if (countdown === 0) {
            (async () => {
                try {
                    // 🔥 PRE-WARM AI HERE (HIDDEN FROM USER)
                    const res = await api.post("/game-chat/imposter-message", {
                        chatId,
                        userText: "start the discussion"
                    });

                    const initialMessages = [
                        {
                            sender: res.data.senderName,
                            text: res.data.text
                        },
                        ...(res.data.followUp || []).map(f => ({
                            sender: f.senderName,
                            text: f.text
                        }))
                    ];

                    navigate("/chat", {
                        state: {
                            topic,
                            chatId,
                            initialMessages
                        }
                    });
                } catch (err) {
                    console.error("Warmup failed:", err);
                    navigate("/chat", {
                        state: { topic, chatId }
                    });
                }
            })();

            return;
        }

        const timer = setTimeout(() => {
            setCountdown(c => c - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, topic, chatId, navigate]);

    /* ---------------- LOADING/ERROR GUARD ---------------- */

    if (error) {
        return (
            <div className="chat-info-page">
                <div className="info-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => navigate("/spot-game")}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#c9377d",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (loading || !topic || !chatId) {
        return (
            <div className="chat-info-page">
                <div className="info-container">
                    <p>Loading game...</p>
                </div>
            </div>
        );
    }

    /* ---------------- UI (UNCHANGED) ---------------- */

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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatInfoPage.css";

export default function ChatInfoPage() {
    const navigate = useNavigate();
    const TOTAL_TIME = 10;
    const [countdown, setCountdown] = useState(TOTAL_TIME);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/chat");
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((c) => c - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    return (
        <div className="chat-info-page">
            <div className="info-container">
                <h1 className="game-title">🎭 Spot Imposter Game</h1>
                <p className="subtitle">Read your role and topic carefully!</p>

                <div className="card topic-card">
                    <h3>Chat Topic</h3>
                    <p className="topic-text">
                        What’s your favorite memory from school?
                    </p>
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

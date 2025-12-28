import { useState, useEffect } from "react";
import { MessageCircle, EyeOff, Eye, Clock, Sparkles } from "lucide-react";
import "./ChatInfoPage.css";

{/*imposter/innocent randomized*/ }
export default function ChatInfoPage() {
    const [countdown, setCountdown] = useState(6);
    const [showOverlay, setShowOverlay] = useState(false);

    // ✅ Random role ONCE per page load
    const [isImposter] = useState(() => Math.random() < 0.5);

    // Mock game data (replace later with backend)
    const chatTopic = "Best vacation destinations";
    const secretWords = ["beach", "expensive", "crowded"];

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowOverlay(true);

                    // TODO: navigate to chat page
                    setTimeout(() => {
                        console.log("Navigate to chat page");
                    }, 1200);

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="page">
            <div className="container">

                {/* Topic */}
                <div className="card topic-card">
                    <div className="card-header">
                        <MessageCircle />
                        <span>Chat Topic</span>
                    </div>
                    <h2>{chatTopic}</h2>
                </div>

                {/* Role */}
                <div className={`card role-card ${isImposter ? "imposter" : "innocent"}`}>
                    <div className="card-header">
                        {isImposter ? <EyeOff /> : <Eye />}
                        <span>Your Role</span>
                    </div>

                    <h2>
                        {isImposter ? "🕵️ Imposter" : "😇 Innocent"}
                    </h2>

                    <p className="role-desc">
                        {isImposter
                            ? "Blend in! Don’t get caught…"
                            : "Find the imposter among you!"}
                    </p>

                    {/* Secret words ONLY for imposter */}
                    {isImposter && (
                        <>
                            <div className="divider" />

                            <div className="secret">
                                <div className="secret-header">
                                    <Sparkles />
                                    <span>Secret words to include</span>
                                </div>

                                <div className="chips">
                                    {secretWords.map((word) => (
                                        <span key={word} className="chip">
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Timer */}
                <div className="card timer-card">
                    <div className="timer-row">
                        <div className="timer-left">
                            <Clock />
                            <span>Game starting in</span>
                        </div>
                        <div className="timer-num">{countdown}</div>
                    </div>

                    <div className="progress">
                        <div
                            className="progress-bar"
                            style={{ width: `${(countdown / 6) * 100}%` }}
                        />
                    </div>
                </div>

            </div>

            {/* Transition Overlay */}
            {showOverlay && (
                <div className="overlay">
                    <h1>Let’s Chat 💬</h1>
                </div>
            )}
        </div>
    );
}

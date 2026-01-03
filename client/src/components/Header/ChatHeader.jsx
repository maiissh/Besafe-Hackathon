import { Coins, MessageCircle, Clock } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "./ChatHeader.css";

export default function ChatHeader({ topic, points }) {
    const TOTAL_TIME = 90; // 1.5 minutes
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <header className="chat-header">
            <div className="chat-header-top">
                {/* LEFT: Topic */}
                <div className="chat-topic">
                    <MessageCircle className="topic-icon" />
                    <div>
                        <h1 className="topic-title">Chat Topic</h1>
                        <p className="topic-text">{topic}</p>
                    </div>
                </div>

                {/* RIGHT: Timer + Points */}
                <div className="badges-group">
                    <div className="timer-badge">
                        <Clock size={22} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>

                    <div className="points-badge">
                        <Coins size={22} />
                        <span>{points}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

ChatHeader.propTypes = {
    topic: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
};

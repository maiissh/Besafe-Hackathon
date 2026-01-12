import { Coins, MessageCircle, Clock } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatHeader.css";

export default function ChatHeader({ topic, points }) {
    const navigate = useNavigate();
    const TOTAL_TIME = 120;
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

    const handleBeSafeClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("BeSafe clicked, navigating to homepage");
        window.location.href = "/homepage";
    };

    return (
        <header className="chat-header">
            <div className="chat-header-top">
                {/* LEFT: BeSafe Logo + Topic */}
                <div className="chat-header-left">
                    <span
                        onClick={handleBeSafeClick}
                        className="besafe-logo-text"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleBeSafeClick(e);
                            }
                        }}
                        aria-label="Go to homepage"
                    >
                        BeSafe
                    </span>
                    <div className="chat-topic">
                        <MessageCircle className="topic-icon" />
                        <div>
                            <h1 className="topic-title">Chat Topic</h1>
                            <p className="topic-text">{topic}</p>
                        </div>
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

import { Flame, Coins, MessageCircle } from "lucide-react";
import PropTypes from "prop-types";
import "./ChatHeader.css";

export default function ChatHeader({ topic, points, streak }) {
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

                {/* RIGHT: Badges */}
                <div className="badges-group">
                    <div className="streak-badge">
                        <Flame size={26} />
                        <span>{streak}</span>
                    </div>

                    <div className="points-badge">
                        <Coins size={26} />
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
    streak: PropTypes.number.isRequired,
};

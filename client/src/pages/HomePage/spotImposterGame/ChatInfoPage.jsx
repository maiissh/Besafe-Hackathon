import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatInfoPage.css";

export default function ChatInfoPage() {
    const navigate = useNavigate();
    const TOTAL_TIME = 5;
    const [countdown, setCountdown] = useState(TOTAL_TIME);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/chat");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="chat-info-page">
            <div className="info-card">
                <h1>Chat Info Page</h1>
                <p>Game starts in:</p>
                <div className="countdown">{countdown}</div>
            </div>
        </div>
    );
}

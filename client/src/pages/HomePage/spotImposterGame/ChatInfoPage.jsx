import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
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
            <Header points={120} streak={4} />

            <div className="info-card">
                <h2>Game starts in</h2>
                <div className="countdown">{countdown}</div>
            </div>
        </div>
    );
}

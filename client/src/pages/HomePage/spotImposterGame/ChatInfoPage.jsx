import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 24,
            }}
        >
            <h1>Chat Info Page</h1>
            <p>Game starts in:</p>
            <h2>{countdown}</h2>
        </div>
    );
}

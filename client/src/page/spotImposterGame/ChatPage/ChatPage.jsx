import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatHeader from "../../../components/Header/ChatHeader";
import "./ChatPage.css";

export default function ChatPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const topic = location.state?.topic;

    // ✅ Initialize messages lazily from topic (NO effect needed)
    const [messages, setMessages] = useState(() => {
        if (!topic) return [];
        return [
            { sender: "System", text: `Welcome to the chat! Topic: "${topic.text}"` },
            { sender: "Sam", text: "Really? That's cool!" },
        ];
    });

    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // ✅ Redirect safely INSIDE useEffect (hooks rule safe)
    useEffect(() => {
        if (!topic) {
            navigate("/");
        }
    }, [topic, navigate]);

    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            { sender: "You", text: input.trim() },
        ]);

        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    // ✅ Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ Safe render guard AFTER hooks
    if (!topic) return null;

    return (
        <div className="chat-page">
            <ChatHeader topic={topic.text} points={150} />

            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender === "You" ? "own" : ""}`}
                        >
                            <span className="sender">{msg.sender}</span>
                            <div className="bubble">{msg.text}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage}>➤</button>
                </div>
            </div>
        </div>
    );
}

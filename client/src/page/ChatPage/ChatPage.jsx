import { useState, useEffect, useRef } from "react";
import ChatHeader from "../../../components/Header/ChatHeader";
import "./ChatPage.css";

export default function ChatPage() {
    const chatTopic = "What’s your favorite memory from school?";

    const [messages, setMessages] = useState([
        { sender: "System", text: `Welcome to the chat! Topic: "${chatTopic}"` },
        { sender: "Sam", text: "Really? That's cool!" },
    ]);

    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

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

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-page">
            <ChatHeader topic={chatTopic} coins={0} streak={0} />

            <div className="chat-container">
                {/* Messages */}
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

                {/* Input */}
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

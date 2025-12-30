import { useState } from "react";
import Header from "../../../components/Header/Header";
import "./ChatPage.css";

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { sender: "System", text: "Welcome to the chat!" },
        { sender: "Sam", text: "Really? That's cool!" }
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { sender: "You", text: input }]);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-page">
            <Header points={150} streak={5} />

            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`message ${msg.sender === "You" ? "own" : ""}`}
                        >
                            <span className="sender">{msg.sender}</span>
                            <div className="bubble">{msg.text}</div>
                        </div>
                    ))}
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

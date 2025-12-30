import { useState } from "react";
import "./ChatPage.css";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, input]);
        setInput("");
    };

    return (
        <div className="chat-page">
            <header className="chat-header">
                <h1>Chat Page</h1>
            </header>

            <div className="chat-body">
                {messages.map((msg, i) => (
                    <div key={i} className="chat-message">
                        {msg}
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

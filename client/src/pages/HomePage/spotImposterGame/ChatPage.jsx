import { useState } from "react";
import Header from "../../../components/Header/Header";
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
            <Header points={120} streak={4} />

            <div className="chat-container">
                <div className="messages">
                    {messages.map((msg, i) => (
                        <div key={i} className="message">
                            {msg}
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

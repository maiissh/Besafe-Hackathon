import { useState } from "react";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, input]);
        setInput("");
    };

    return (
        <div
            style={{
                height: "100vh",
                padding: 20,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h1>Chat Page</h1>

            <div
                style={{
                    flex: 1,
                    border: "1px solid #ccc",
                    padding: 10,
                    marginBottom: 10,
                    overflowY: "auto",
                }}
            >
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type message"
                    style={{ flex: 1 }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

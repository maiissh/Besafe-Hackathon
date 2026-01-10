/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import './Serena.css';

import Header from '../../components/Header/Header';
import studentService from '../../services/studentService';

/* --- 🔗 SERVER LINK --- */
const API_ENDPOINT = import.meta.env.VITE_SERVER_API_URL + 'api/chat';

const SUGGESTIONS = [
  "How do I block a bully?",
  "Is this link safe?",
  "Create a strong password",
  "Tips for Roblox safety",
];

const WELCOME_MSG = `Hey! I’m Serena 💬
I am connected to your secure server.
Ask me ANYTHING—about games, safety, or life. 💙`;

/* --- AVATAR COMPONENT --- */
const SerenaAvatar = ({ size = "large" }) => {
  const width = size === "large" ? "80" : "45";
  const height = size === "large" ? "80" : "45";
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" className="serena-svg">
      <circle cx="50" cy="50" r="45" fill="rgba(255, 255, 255, 0.4)" className="halo-pulse" />
      <circle cx="50" cy="50" r="35" fill="white" stroke="#8e44ad" strokeWidth="2" />
      <rect x="10" y="40" width="10" height="20" rx="5" fill="#d946ef" />
      <rect x="80" y="40" width="10" height="20" rx="5" fill="#d946ef" />
      <path d="M 15 45 Q 50 -10 85 45" stroke="#d946ef" strokeWidth="4" fill="none" />
      <g className="eyes-blink">
        <ellipse cx="35" cy="50" rx="5" ry="7" fill="#2e1065" />
        <ellipse cx="65" cy="50" rx="5" ry="7" fill="#2e1065" />
        <circle cx="37" cy="48" r="2" fill="white" />
        <circle cx="67" cy="48" r="2" fill="white" />
      </g>
      <path d="M 40 65 Q 50 70 60 65" stroke="#2e1065" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="50" y1="15" x2="50" y2="5" stroke="#8e44ad" strokeWidth="2" />
      <circle cx="50" cy="5" r="3" fill="#00d2ff" className="antenna-glow" />
    </svg>
  );
};

/* --- MAIN COMPONENT --- */
const Serena = () => {
  const [messages, setMessages] = useState([{ role: 'bot', content: WELCOME_MSG }]);

  // الحالة الافتراضية 0 حتى يتم جلب البيانات الحقيقية
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('serena_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // جلب البيانات الحقيقية عند فتح الصفحة
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const student = await studentService.getCurrentStudent();
        if (student) {
          setPoints(student.points || 0);
          setStreak(student.streak || 0);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem('serena_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (activeChatId) {
      setHistory(prevHistory =>
        prevHistory.map(chat =>
          chat.id === activeChatId
            ? { ...chat, savedMessages: messages }
            : chat
        )
      );
    }
  }, [messages, activeChatId]);

  const startNewChat = () => {
    setMessages([{ role: 'bot', content: WELCOME_MSG }]);
    setActiveChatId(null);
  };

  const loadChat = (targetChat) => {
    setMessages(targetChat.savedMessages);
    setActiveChatId(targetChat.id);
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
    if (activeChatId === id) {
      startNewChat();
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const newUserMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // ❌ تم حذف السطر الذي كان يزيد النقاط محلياً (setPoints)
    // الآن ستبقى النقاط كما جاءت من قاعدة البيانات بالضبط

    let currentChatId = activeChatId;
    if (!currentChatId) {
      const newId = Date.now();
      const title = text.substring(0, 20) + (text.length > 20 ? "..." : "");

      const newHistoryItem = {
        id: newId,
        title: title,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        savedMessages: updatedMessages
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      setActiveChatId(newId);
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("Server Error");
      const data = await response.json();
      const botReply = data.reply || "Thinking...";

      setMessages(prev => [...prev, { role: 'bot', content: botReply }]);

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "⚠️ Error: Check Server Connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="serena-page-wrapper">

      {/* الهيدر يعرض النقاط الثابتة القادمة من السيرفر */}
      <Header points={points} streak={streak} />

      <div className="serena-chat-body">
        <div className="app-layout">
          <aside className="sidebar">
            <button className="new-chat-btn" onClick={startNewChat}>+ NEW CHAT</button>
            <div className="history-label">Logs</div>
            <div className="history-list">
              {history.map((h) => (
                <div key={h.id} className={`history-item ${activeChatId === h.id ? 'active-chat' : ''}`} onClick={() => loadChat(h)}>
                  <div className="history-info">
                    <span className="history-title">{h.title}</span>
                    <span className="history-date">{h.date}</span>
                  </div>
                  <button className="delete-btn" onClick={(e) => deleteHistoryItem(h.id, e)}>×</button>
                </div>
              ))}
            </div>
          </aside>

          <main className="main-content">
            <section className="chat-window">
              {messages.map((m, i) => (
                <div key={i} className={`message-row ${m.role}`}>
                  <div className="avatar-wrapper">
                    {m.role === 'user' ? <div className="user-avatar">You</div> : <SerenaAvatar size="small" />}
                  </div>
                  <div className="bubble" dangerouslySetInnerHTML={{
                    __html: m.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                  }} />
                </div>
              ))}
              {isLoading && (
                <div className="message-row bot">
                  <div className="avatar-wrapper"><SerenaAvatar size="small" /></div>
                  <div className="bubble">Thinking...</div>
                </div>
              )}
              <div ref={chatScrollRef} />
            </section>

            <footer className="footer-input">
              {messages.length < 2 && (
                <div className="notebook-grid">
                  {SUGGESTIONS.map(s => (
                    <div key={s} className="notebook-card" onClick={() => handleSend(s)}>{s}</div>
                  ))}
                </div>
              )}
              <div className="input-area">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask ANYTHING..."
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button className="send-btn" onClick={() => handleSend()}>SEND</button>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Serena;
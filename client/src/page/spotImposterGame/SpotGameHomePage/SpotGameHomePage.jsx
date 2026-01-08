import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socketService from "../../../services/socketService.js";
import studentService from "../../../services/studentService.js";
import Header from "../../../components/Header/Header.jsx";
import "./SpotGameHomePage.css";
import { Search, Ghost, MessageCircle, Bot, ShieldQuestion, User, Fingerprint, Eye, Lock, Sparkles } from 'lucide-react';
const SpotGameHomePage = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    points: 0,
    streak: 0
  });

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const studentData = await studentService.getCurrentStudent();
        if (studentData) {
          setStudent({
            points: studentData.points || 0,
            streak: studentData.streak || 0
          });
        }
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    };
    loadStudent();
  }, []);


  // 1. State for managing which section is visible ('join', 'create', or null)
  const [activeSection, setActiveSection] = useState(null);

  // 2. State for inputs
  const [roomId, setRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");

  // 3. State for "Room Created" success message
  const [createdRoomData, setCreatedRoomData] = useState(null);

  // --- HANDLERS ---

  // Handle "Join Room" button click
  const handleJoinClick = () => {
    setActiveSection("join");
    setCreatedRoomData(null); // Reset any previous results
  };

  // Handle "Create Room" button click
  const handleCreateClick = () => {
    setActiveSection("create");
    setCreatedRoomData(null); // Reset any previous results
  };

  // Handle submitting the Join request
  const handleSubmitJoin = () => {
    if (roomId.trim()) {
      // Connect to socket or navigate to lobby
      socketService.joinRoom(roomId);
      navigate("/chat-info");
    } else {
      alert("Please enter a valid Room ID");
    }
  };

  // Handle submitting the Create request
  const handleSubmitCreate = () => {
    if (newRoomName.trim()) {
      // Mock logic: Generate a fake Room ID for now
      const mockNewId = "ROOM-" + Math.floor(Math.random() * 10000);
      const shareUrl = `${window.location.origin}/join/${mockNewId}`;

      // Show the result
      setCreatedRoomData({ id: mockNewId, url: shareUrl });
    } else {
      alert("Please enter a room name");
    }
  };

  const handleDemoClick = () => {
    // Navigate to the chat page immediately
    // We send { demoMode: true } so the Chat Page knows to load bots!
    navigate("/chat-info", { state: { demoMode: true, roomName: "Demo Room" } });
  };

  return (
    <div className="game-wrapper">
      <div className="game-background">
          <Ghost className="bg-icon icon-ghost" />
          <Search className="bg-icon icon-search" />
          <MessageCircle className="bg-icon icon-msg" />
          <Bot className="bg-icon icon-bot" />
          <ShieldQuestion className="bg-icon icon-shield" />
          <User className="bg-icon icon-user" />
          <Fingerprint className="bg-icon icon-fingerprint" />
          <Eye className="bg-icon icon-eye" />
          <Lock className="bg-icon icon-lock" />
          <Sparkles className="bg-icon icon-sparkles" />
      </div>
      <Header points={student.points} streak={student.streak} />

      <div className="game-container">

        {/* 1. Short Explanation of the Game */}
        <section className="game-intro">
          <h2>Spot the Imposter 🕵🏼‍♀️🥷🏻</h2>
          <p>
            In this game, you will chat with others in a group. But be careful!
            One person is an <strong>Imposter</strong> trying to trick you.
            Can you spot who is real and who is fake? Let&apos;s See !
          </p>
        </section>

        <div className="action-buttons">

          {/* 2. Button: Join a Room */}
          <button className="primary-btn" onClick={handleJoinClick}>
            Join a Room
          </button>

          {/* Conditional Rendering: Join Input */}
          {activeSection === "join" && (
            <div className="input-group slide-down">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button className="submit-btn" onClick={handleSubmitJoin}>
                Submit
              </button>
            </div>
          )}

          <div className="divider">OR</div>

          {/* 3. Button: Create a Room */}
          <button className="secondary-btn" onClick={handleCreateClick}>
            Create a Room
          </button>

          {/* Conditional Rendering: Create Input */}
          {activeSection === "create" && !createdRoomData && (
            <div className="input-group slide-down">
              <input
                type="text"
                placeholder="Enter Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <button className="submit-btn" onClick={handleSubmitCreate}>
                Submit
              </button>
            </div>
          )}

          {/* Result: Show Room ID and URL after creating */}
          {createdRoomData && (
            <div className="result-box slide-down">
              <h3>Room Created!</h3>
              <p><strong>Room ID:</strong> {createdRoomData.id}</p>
              <p><strong>Share Link:</strong></p>
              <div className="url-box">{createdRoomData.url}</div>
              <p className="small-text">Share this with your friends to play!</p>
            </div>
          )}
          <div className="divider" style={{ marginTop: '20px' }}>OR</div>
          <button className="demo-btn" onClick={handleDemoClick}>
            Play with AI Bots 🤖
          </button>

        </div>
      </div>
    </div>
  );
};

export default SpotGameHomePage;
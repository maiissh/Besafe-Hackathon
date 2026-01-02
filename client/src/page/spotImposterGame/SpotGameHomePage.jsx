// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // To move to Page 2 later
// import socketService from "../../services/socketService.js";
// import Header from '../../components/Header/Header.jsx';
// import './SpotGameHomePage.css';

// const SpotGameHomePage = () => {
//     const navigate = useNavigate();
//     const [playerName, setPlayerName] = useState('');
//     const [isSearching, setIsSearching] = useState(false);

//     useEffect(() => {
//         socketService.connect();
//         socketService.on('gameStarted', (data) => {
//             setIsSearching(false);
//             navigate('/game/lobby', { state: { roomData: data } });
//         });
//         return () => socketService.disconnect();
//     }, [navigate]);

//     const handleStartGame = () => {
//         if (!playerName.trim()) {
//             alert('Please enter your name to start.');
//             return;
//         }
//         setIsSearching(true);
//         socketService.emit('createBotGame', { 
//             playerName: playerName,
//             botCount: 3
//         });
//     };

//     return (
//         <div className="game-home-container">
//             <Header coins={100} />

//             <main className="home-content">
//                 <section className="hero-section">
//                     <h1 className="hero-title">
//                         Ready to spot the <span className="highlight-text">Imposter?</span>
//                     </h1>
//                     <p className="hero-subtitle">
//                         Enter the chat simulation and outsmart the bots!
//                     </p>
//                 </section>

//                 <section className="rules-badges-container">
//                     <div className="rule-badge badge-purple">
//                         <span className="badge-icon">⏱️</span>
//                         <div className="badge-text">
//                             <strong>2 Minutes</strong>
//                             <span>Quick Chat</span>
//                         </div>
//                     </div>
//                     <div className="rule-badge badge-blue">
//                         <span className="badge-icon">🤖</span>
//                         <div className="badge-text">
//                             <strong>3 Bots</strong>
//                             <span>Vs You</span>
//                         </div>
//                     </div>
//                     <div className="rule-badge badge-pink">
//                         <span className="badge-icon">🕵️‍♀️</span>
//                         <div className="badge-text">
//                             <strong>1 Imposter</strong>
//                             <span>Hidden</span>
//                         </div>
//                     </div>
//                 </section>

//                 <section className="action-card">
//                     <h3 className="card-heading">Join the Session</h3>
                    
//                     <div className="input-group">
//                         <label htmlFor="playerName">Choose your Agent Name</label>
//                         <input 
//                             id="playerName"
//                             type="text" 
//                             placeholder="e.g., CyberSafe_99" 
//                             value={playerName}
//                             onChange={(e) => setPlayerName(e.target.value)}
//                             disabled={isSearching}
//                             autoComplete="off"
//                         />
//                     </div>

//                     <button 
//                         className={`start-btn ${isSearching ? 'loading' : ''}`}
//                         onClick={handleStartGame}
//                         disabled={isSearching}
//                     >
//                         {isSearching ? (
//                             <>Initializing Simulation<span className="dots">...</span></>
//                         ) : (
//                             <>Start Mission 🚀</>
//                         )}
//                     </button>
//                 </section>
//             </main>
//         </div>
//     );
// };

// export default SpotGameHomePage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socketService from "../../services/socketService.js";
import Header from "../../components/Header/Header.jsx";
import "./SpotGameHomePage.css"; 

const SpotGameHomePage = () => {
  const navigate = useNavigate();

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
      <Header points={120} streak={5} />

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
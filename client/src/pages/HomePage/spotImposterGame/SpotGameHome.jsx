import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To move to Page 2 later
import socketService from '../services/socketService';
import Header from '../components/Header';

const GameHome = () => {
    const navigate = useNavigate();
    
    // UI State management
    const [view, setView] = useState('menu'); // 'menu', 'join', 'create'
    const [roomId, setRoomId] = useState('');
    const [roomName, setRoomName] = useState('');
    const [playerName, setPlayerName] = useState(''); // Need player name per Phase 1.3
    
    // Initialize socket on load
    useEffect(() => {
        socketService.connect();
        
        // Listen for successful room entry (Future Phase 1 implementation)
        socketService.on('roomJoined', (data) => {
            console.log('Joined room:', data);
            // navigate('/lobby'); // Move to Page 2
        });

        return () => socketService.disconnect();
    }, []);

    const handleCreateRoom = () => {
        if (!roomName || !playerName) return alert('Please fill all fields');
        
        // Emitting event based on Phase 1.2 & 1.3 Requirements
        socketService.emit('createRoom', { roomName, playerName });
    };

    const handleJoinRoom = () => {
        if (!roomId || !playerName) return alert('Please fill all fields');

        // Emitting event based on Phase 1.3 Requirements
        socketService.emit('joinRoom', { roomId, playerName });
    };

    return (
        <div className="game-home-container">
            <Header coins={150} />
            
            <main>
                <h1>Spot the Imposter</h1>
                <p>Find who is faking it! You have 2 minutes to chat.</p>

                {/* Initial View */}
                {view === 'menu' && (
                    <div className="menu-buttons">
                        <input 
                            type="text" 
                            placeholder="Your Nickname" 
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                        />
                        <button onClick={() => setView('join')}>Join a Room</button>
                        <button onClick={() => setView('create')}>Create a Room</button>
                    </div>
                )}

                {/* Join Room View */}
                {view === 'join' && (
                    <div className="action-box">
                        <input 
                            type="text" 
                            placeholder="Enter Room ID" 
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button onClick={handleJoinRoom}>Submit</button>
                        <button className="back-btn" onClick={() => setView('menu')}>Back</button>
                    </div>
                )}

                {/* Create Room View */}
                {view === 'create' && (
                    <div className="action-box">
                        <input 
                            type="text" 
                            placeholder="Enter Room Name" 
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                        <button onClick={handleCreateRoom}>Submit</button>
                        <button className="back-btn" onClick={() => setView('menu')}>Back</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default GameHome;
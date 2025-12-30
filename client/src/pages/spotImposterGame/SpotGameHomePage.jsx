import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To move to Page 2 later
import socketService from 'src/services/socketService.js';
import Header from 'src/components/Header';
import 'client\src\styles\SpotGameHomePage.css';

const SpotGameHomePage = () => {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        socketService.connect();
        socketService.on('gameStarted', (data) => {
            setIsSearching(false);
            navigate('/game/lobby', { state: { roomData: data } });
        });
        return () => socketService.disconnect();
    }, [navigate]);

    const handleStartGame = () => {
        if (!playerName.trim()) {
            alert('Please enter your name to start.');
            return;
        }
        setIsSearching(true);
        socketService.emit('createBotGame', { 
            playerName: playerName,
            botCount: 3
        });
    };

    return (
        <div className="game-home-container">
            <Header coins={100} />

            <main className="home-content">
                <section className="hero-section">
                    <h1 className="hero-title">
                        Ready to spot the <span className="highlight-text">Imposter?</span>
                    </h1>
                    <p className="hero-subtitle">
                        Enter the chat simulation and outsmart the bots!
                    </p>
                </section>

                <section className="rules-badges-container">
                    <div className="rule-badge badge-purple">
                        <span className="badge-icon">⏱️</span>
                        <div className="badge-text">
                            <strong>2 Minutes</strong>
                            <span>Quick Chat</span>
                        </div>
                    </div>
                    <div className="rule-badge badge-blue">
                        <span className="badge-icon">🤖</span>
                        <div className="badge-text">
                            <strong>3 Bots</strong>
                            <span>Vs You</span>
                        </div>
                    </div>
                    <div className="rule-badge badge-pink">
                        <span className="badge-icon">🕵️‍♀️</span>
                        <div className="badge-text">
                            <strong>1 Imposter</strong>
                            <span>Hidden</span>
                        </div>
                    </div>
                </section>

                <section className="action-card">
                    <h3 className="card-heading">Join the Session</h3>
                    
                    <div className="input-group">
                        <label htmlFor="playerName">Choose your Agent Name</label>
                        <input 
                            id="playerName"
                            type="text" 
                            placeholder="e.g., CyberSafe_99" 
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            disabled={isSearching}
                            autoComplete="off"
                        />
                    </div>

                    <button 
                        className={`start-btn ${isSearching ? 'loading' : ''}`}
                        onClick={handleStartGame}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <>Initializing Simulation<span className="dots">...</span></>
                        ) : (
                            <>Start Mission 🚀</>
                        )}
                    </button>
                </section>
            </main>
        </div>
    );
};

export default SpotGameHomePage;
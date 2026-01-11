import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/Header/Header.jsx";
import BottomNav from "../../../components/BottomNav/BottomNav.jsx";
import studentService from "../../../services/studentService.js";
import "./VotingPage.css";

/* ================= Helpers ================= */

function readJSON(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function normalizePlayers(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((p, idx) => {
      if (typeof p === "string") return { id: `p_${idx}`, name: p };
      if (p && typeof p === "object") {
        const id = p.id ?? p._id ?? p.socketId ?? p.playerId ?? `p_${idx}`;
        const name = p.name ?? String(id);
        return { id: String(id), name: String(name) };
      }
      return null;
    })
    .filter(Boolean);
}

function normalizeMessages(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((m, idx) => {
      if (typeof m === "string") return { id: `m_${idx}_${Date.now()}`, text: m };
      if (m && typeof m === "object") {
        const id = m.id ?? m._id ?? `m_${idx}_${Date.now()}`;
        const text = m.text ?? String(m);
        return { id: String(id), text: String(text) };
      }
      return null;
    })
    .filter(Boolean);
}

// Default student object
const DEFAULT_STUDENT = {
  name: "Guest",
  points: 0,
  streak: 0,
  coins: 0,
  currentLevel: 1,
  completedLevels: 0,
};

// Helper function to get initial student data
async function getInitialStudent() {
  try {
    const student = await studentService.getCurrentStudent();
    if (student) return student;

    studentService.saveStudentToLocal(DEFAULT_STUDENT);
    return DEFAULT_STUDENT;
  } catch {
    return DEFAULT_STUDENT;
  }
}

/* ================= AnimatedBackground Component ================= */

const AnimatedBackground = () => (
  <div className="background-wrapper">
    <div className="gradient-overlay"></div>
    <div className="floating-orb orb-pink"></div>
    <div className="floating-orb orb-purple"></div>
    <div className="floating-orb orb-blue"></div>
  </div>
);

/* ================= Component ================= */

export default function VotingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const results = useMemo(() => {
    return location.state || readJSON("spotImposterResults", null);
  }, [location.state]);

  /* ====== Points & Streak using studentService ====== */
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  // Load student data on mount
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const studentData = await getInitialStudent();
        setPoints(studentData.points || 0);
        setStreak(studentData.streak || 0);
      } catch (error) {
        console.error("Error loading student:", error);
        setPoints(0);
        setStreak(0);
      }
    };

    loadStudent();
  }, []);

  /* ====== Phase control ====== */
  const [currentPhase, setCurrentPhase] = useState("imposterVoting");

  /* ====== Players ====== */
  const players = useMemo(() => {
    const fallback = [
      { id: "bot_1", name: "Lina" },
      { id: "bot_2", name: "Noor" },
      { id: "bot_3", name: "Maya" },
      { id: "you", name: "You" },
    ];
    const p = normalizePlayers(results?.players ?? results?.bots ?? []);
    return p.length ? p : fallback;
  }, [results]);

  /* ====== Dynamic Imposter (NOT FIXED) ====== */
  const IMPOSTER_ID = useMemo(() => {
    const raw =
      results?.imposterId ??
      results?.imposterBotId ??
      results?.imposter?.id ??
      null;
    return raw === null || raw === undefined ? null : String(raw);
  }, [results]);

  const imposterName = useMemo(() => {
    const direct =
      results?.imposterName ??
      results?.imposterBotName ??
      results?.imposter?.name ??
      null;

    if (direct) return String(direct);

    const found = players.find((p) => String(p.id) === String(IMPOSTER_ID));
    return found?.name || "Unknown";
  }, [results, players, IMPOSTER_ID]);

  /* =========================
     PHASE 1: Imposter Voting
     ========================= */
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [imposterVotingComplete, setImposterVotingComplete] = useState(false);
  const [isCorrectImposter, setIsCorrectImposter] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [realImposter, setRealImposter] = useState("");

  const COINS_FOR_CORRECT = 30;

  /* =========================
     PHASE 2: Message Voting
     ========================= */
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messageVotingComplete, setMessageVotingComplete] = useState(false);
  const [correctMessageAnswers, setCorrectMessageAnswers] = useState([]);
  const [messageCoinsEarned, setMessageCoinsEarned] = useState(0);

  const imposterMessagesWithWord = useMemo(() => {
    return normalizeMessages(results?.imposterMessagesWithWord ?? []);
  }, [results]);

  const imposterMessagesWithoutWord = useMemo(() => {
    return normalizeMessages(results?.imposterMessagesWithoutWord ?? []);
  }, [results]);

  const imposterMessages = useMemo(() => {
    const demoWith = [
      { id: "with_demo_1", text: "I totally agree with what everyone is saying here!" },
      { id: "with_demo_2", text: "Yeah, that makes sense to me too." },
    ];
    const demoWithout = [
      { id: "without_demo_1", text: "I think social media can be both good and bad depending on how you use it." },
      { id: "without_demo_2", text: "Honestly, I've never really thought about it that way before." },
      { id: "without_demo_3", text: "My friends and I were just talking about this yesterday!" },
    ];

    const withList = imposterMessagesWithWord.length ? imposterMessagesWithWord : demoWith;
    const withoutList = imposterMessagesWithoutWord.length ? imposterMessagesWithoutWord : demoWithout;

    const withWord = withList.map((m) => ({
      id: m.id,
      text: m.text,
      sender: imposterName,
      isCorrect: true,
    }));

    const withoutWord = withoutList.map((m) => ({
      id: m.id,
      text: m.text,
      sender: imposterName,
      isCorrect: false,
    }));

    return [...withWord, ...withoutWord];
  }, [imposterMessagesWithWord, imposterMessagesWithoutWord, imposterName]);

  const CORRECT_MESSAGE_IDS = useMemo(() => {
    return imposterMessages.filter((m) => m.isCorrect).map((m) => m.id);
  }, [imposterMessages]);

  const POINTS_PER_CORRECT_MESSAGE = 3;

  /* =========================
     PHASE 3: Results Analytics (demo)
     ========================= */
  const totalCoinsEarned = coinsEarned + messageCoinsEarned;

  const playerVotes = useMemo(() => {
    if (results?.playerVotes) return results.playerVotes;

    const totalPlayers = players.length;
    const votesDistribution = Array(players.length).fill(0);

    if (selectedPlayer) {
      const idx = players.findIndex((p) => String(p.id) === String(selectedPlayer));
      if (idx !== -1) votesDistribution[idx] += 1;
    }

    const remainingVotes = Math.max(0, totalPlayers - (selectedPlayer ? 1 : 0));
    // Distribute votes evenly instead of randomly
    for (let i = 0; i < remainingVotes; i++) {
      const r = i % players.length;
      votesDistribution[r]++;
    }

    return players.map((player, index) => ({
      id: player.id,
      name: player.name,
      voteCount: votesDistribution[index],
      isImposter: IMPOSTER_ID ? String(player.id) === String(IMPOSTER_ID) : false,
    }));
  }, [results, players, selectedPlayer, IMPOSTER_ID]);

  const messageVotes = useMemo(() => {
    if (results?.messageVotes) return results.messageVotes;

    const totalPlayers = players.length;
    const totalVotes = totalPlayers * 2;
    const votesDistribution = Array(imposterMessages.length).fill(0);

    selectedMessages.forEach((msgId) => {
      const idx = imposterMessages.findIndex((m) => m.id === msgId);
      if (idx !== -1) votesDistribution[idx]++;
    });

    const remainingVotes = Math.max(0, totalVotes - selectedMessages.length);
    // Distribute votes evenly instead of randomly
    for (let i = 0; i < remainingVotes; i++) {
      const r = i % imposterMessages.length;
      votesDistribution[r]++;
    }

    return imposterMessages.map((message, index) => ({
      id: message.id,
      text: message.text,
      voteCount: votesDistribution[index],
      isCorrect: message.isCorrect,
    }));
  }, [results, players.length, imposterMessages, selectedMessages]);

  /* ================= Handlers ================= */

  const handleVotePlayer = (playerId) => setSelectedPlayer(playerId);

  const handleSubmitImposterVote = async () => {
    if (!selectedPlayer) {
      alert("Please select a player!");
      return;
    }

    const correct = IMPOSTER_ID ? String(selectedPlayer) === String(IMPOSTER_ID) : false;
    setIsCorrectImposter(correct);

    if (correct) {
      setCoinsEarned(COINS_FOR_CORRECT);
      // Add points using studentService
      const updatedStudent = await studentService.addPoints(COINS_FOR_CORRECT);
      if (updatedStudent) {
        setPoints(updatedStudent.points || 0);
      } else {
        setPoints((prev) => prev + COINS_FOR_CORRECT);
      }
    } else {
      setCoinsEarned(0);
    }

    const imposterPlayer = players.find((p) => String(p.id) === String(IMPOSTER_ID));
    setRealImposter(imposterPlayer?.name || imposterName || "Unknown");

    setImposterVotingComplete(true);
    setTimeout(() => setCurrentPhase("messageVoting"), 1200);
  };

  const handleToggleMessage = (messageId) => {
    setSelectedMessages((prev) => {
      if (prev.includes(messageId)) return prev.filter((id) => id !== messageId);
      if (prev.length >= 2) return prev;
      return [...prev, messageId];
    });
  };

  const handleSubmitMessageVotes = async () => {
    if (selectedMessages.length === 0) {
      alert("Please select at least one message!");
      return;
    }

    setCorrectMessageAnswers(CORRECT_MESSAGE_IDS);

    const correctCount = selectedMessages.filter((id) => CORRECT_MESSAGE_IDS.includes(id)).length;
    const earned = correctCount * POINTS_PER_CORRECT_MESSAGE;

    setMessageCoinsEarned(earned);
    if (earned > 0) {
      // Add points using studentService
      const updatedStudent = await studentService.addPoints(earned);
      if (updatedStudent) {
        setPoints(updatedStudent.points || 0);
      } else {
        setPoints((prev) => prev + earned);
      }
    }

    setMessageVotingComplete(true);
    setTimeout(() => setCurrentPhase("results"), 1200);
  };

  const handlePlayAgain = () => {
    localStorage.removeItem("spotImposterResults");
    navigate(`/spot-game?run=${Date.now()}`);
  };

  const handleBackToHome = () => {
    navigate("/homepage", { replace: true });
  };

  const isCorrectMessage = (messageId) => correctMessageAnswers.includes(messageId);
  const isWrongMessage = (messageId) =>
    selectedMessages.includes(messageId) && !correctMessageAnswers.includes(messageId);

  /* ================= Render ================= */

  if (!results) {
    return (
      <>
        <Header points={points} streak={streak} />
        <AnimatedBackground />
        <div className="voting-page">
          <div className="voting-container">
            <div style={{ textAlign: "center", padding: "40px", color: "#374151" }}>
              <h2 style={{ marginBottom: "16px", fontSize: "24px" }}>No Game Results</h2>
              <p style={{ marginBottom: "24px", color: "#6b7280" }}>
                Please start a game to see voting results.
              </p>
              <button 
                onClick={() => navigate("/spot-game")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#c9377d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600"
                }}
              >
                Go to Game
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  /* ====== Phase 1 ====== */
  if (currentPhase === "imposterVoting") {
    if (imposterVotingComplete) {
      return (
        <>
          <Header points={points} streak={streak} />
          <AnimatedBackground />

          <div className="voting-page">
            <div className="voting-container">
              <div className="result-card">
                {isCorrectImposter ? (
                  <>
                    <div className="success-icon">🎉</div>
                    <h2 className="result-title success">You Were Right!</h2>
                    <p className="result-message">
                      Great detective work! You correctly identified the imposter.
                    </p>
                    <div className="coins-earned">
                      <span className="coin-icon">🪙</span>
                      <span className="coin-amount">+{coinsEarned} Coins</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="wrong-icon">😔</div>
                    <h2 className="result-title wrong">Close Guess!</h2>
                    <p className="result-message">
                      The real imposter was <strong>{realImposter}</strong>
                    </p>
                    <p className="encouragement">Better luck next time!</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <BottomNav />
        </>
      );
    }

    return (
      <>
        <Header points={points} streak={streak} />
        <AnimatedBackground />

        <div className="voting-page">
          <div className="voting-container">
            <div className="voting-intro">
              <h2>🔍 Who is the Imposter?</h2>
              <p>Select the player you think was pretending to be someone else</p>
            </div>

            <div className="players-grid">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`player-card ${selectedPlayer === player.id ? "selected" : ""}`}
                  onClick={() => handleVotePlayer(player.id)}
                >
                  <div className="player-avatar">{player.name.charAt(0)}</div>
                  <div className="player-name">{player.name}</div>
                  {selectedPlayer === player.id && <div className="checkmark">✓</div>}
                </div>
              ))}
            </div>

            <button
              className="submit-vote-btn"
              onClick={handleSubmitImposterVote}
              disabled={!selectedPlayer}
            >
              Submit Vote
            </button>
          </div>
        </div>

        <BottomNav />
      </>
    );
  }

  /* ====== Phase 2 ====== */
  if (currentPhase === "messageVoting") {
    if (messageVotingComplete) {
      return (
        <>
          <Header points={points} streak={streak} />
          <AnimatedBackground />

          <div className="message-voting-page">
            <div className="message-voting-container">
              <div className="results-intro">
                <h2>📊 Correct Answers Revealed</h2>
                <p>Here are the messages that contained pressure tactics:</p>
              </div>

              <div className="messages-results-list">
                {imposterMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-result-card ${
                      isCorrectMessage(message.id)
                        ? "correct"
                        : isWrongMessage(message.id)
                        ? "wrong"
                        : "neutral"
                    }`}
                  >
                    <div className="message-result-header">
                      <span className="message-sender">{message.sender}</span>
                      {isCorrectMessage(message.id) && (
                        <span className="correct-badge">✓ Pressure Tactic</span>
                      )}
                      {isWrongMessage(message.id) && (
                        <span className="wrong-badge">✗ Your Selection</span>
                      )}
                    </div>
                    <p className="message-result-text">{message.text}</p>
                  </div>
                ))}
              </div>

              <div className="analysis-note">
                <p>
                  💡 <strong>Analysis:</strong> The imposter used tactics to blend in.
                </p>
              </div>
            </div>
          </div>

          <BottomNav />
        </>
      );
    }

    return (
      <>
        <Header points={points} streak={streak} />
        <AnimatedBackground />

        <div className="message-voting-page">
          <div className="message-voting-container">
            <div className="voting-intro">
              <h2>🔍 Which Messages Look Suspicious?</h2>
              <p>Select up to 2 messages that seem like pressure tactics</p>
              <div className="selection-counter">Selected: {selectedMessages.length}/2</div>
            </div>

            <div className="messages-list">
              {imposterMessages.map((message) => (
                <div
                  key={message.id}
                  className={`message-voting-card ${
                    selectedMessages.includes(message.id) ? "selected" : ""
                  }`}
                  onClick={() => handleToggleMessage(message.id)}
                >
                  <div className="message-header">
                    <span className="message-sender">{message.sender}</span>
                    {selectedMessages.includes(message.id) && (
                      <div className="selected-indicator">✓</div>
                    )}
                  </div>
                  <p className="message-text">{message.text}</p>
                </div>
              ))}
            </div>

            <button
              className="submit-messages-btn"
              onClick={handleSubmitMessageVotes}
              disabled={selectedMessages.length === 0}
            >
              Submit Votes
            </button>
          </div>
        </div>

        <BottomNav />
      </>
    );
  }

  /* ====== Phase 3 ====== */
  if (currentPhase === "results") {
    return (
      <>
        <Header points={points} streak={streak} />
        <AnimatedBackground />

        <div className="results-page">
          <div className="results-container">
            <div className="results-header">
              <div className="trophy-icon">🏆</div>
              <h1 className="results-title">Game Complete!</h1>
              <p className="results-subtitle">Voting Analysis</p>
            </div>

            <div className="analytics-section">
              <h2 className="analytics-title">📊 Imposter Voting Analysis</h2>
              <p className="analytics-subtitle">How many votes each player received</p>

              <div className="votes-chart">
                {playerVotes.map((player) => {
                  const maxVotes = Math.max(...playerVotes.map((p) => p.voteCount));
                  const percentage = maxVotes > 0 ? (player.voteCount / maxVotes) * 100 : 0;

                  return (
                    <div key={player.id} className="vote-bar-container">
                      <div className={`vote-player-name ${player.isImposter ? "imposter-name" : ""}`}>
                        {player.name}
                        {player.isImposter && <span className="imposter-badge">👻 Imposter</span>}
                      </div>
                      <div className="vote-bar-wrapper">
                        <div
                          className={`vote-bar ${player.isImposter ? "imposter-bar" : ""}`}
                          style={{ height: `${percentage}%` }}
                        >
                          <span className="vote-count">
                            {player.voteCount} vote{player.voteCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="analytics-section">
              <h2 className="analytics-title">📝 Message Voting Analysis</h2>
              <p className="analytics-subtitle">How many votes each message received</p>

              <div className="message-votes-chart">
                {messageVotes.map((message, index) => {
                  const maxVotes = Math.max(...messageVotes.map((m) => m.voteCount));
                  const percentage = maxVotes > 0 ? (message.voteCount / maxVotes) * 100 : 0;

                  return (
                    <div key={message.id} className="message-vote-container">
                      <div className="message-vote-header">
                        <span className="message-number">Message {index + 1}</span>
                        {message.isCorrect && <span className="correct-indicator">✓ Pressure Tactic</span>}
                      </div>
                      <div className="message-preview">{message.text}</div>
                      <div className="vote-bar-wrapper">
                        <div
                          className={`vote-bar message-bar ${
                            message.isCorrect ? "correct-message-bar" : ""
                          }`}
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="vote-count">
                            {message.voteCount} vote{message.voteCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="results-summary">
              <div className="summary-card">
                <div className="summary-label">Total Coins Earned This Game</div>
                <div className="summary-value">
                  <span className="coin-icon">🪙</span>
                  <span>{totalCoinsEarned}</span>
                </div>
              </div>
            </div>

            <div className="results-actions">
              <button className="play-again-btn" onClick={handlePlayAgain}>
                🎮 Play Again
              </button>
              <button className="home-btn" onClick={handleBackToHome}>
                🏠 Home
              </button>
            </div>
          </div>
        </div>

        <BottomNav />
      </>
    );
  }

  return null;
}


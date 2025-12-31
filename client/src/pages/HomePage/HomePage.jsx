import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  ShieldCheck,
  MessageCircle,
  Users,
  ArrowRight,
  X,
  Shield,
  Star,
  Lock,
  Heart,
  Award,
  HelpCircle as Help,
} from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import styles from "./Home.module.css";

// Loading duration before showing content
const LOADING_DURATION = 650;

// const MAX_LEVELS = 3;

// Game levels configuration
const LEVELS_CONFIG = [
  { 
    level_number: 1, 
    title: "Cyberbullying", 
    subtitle: "Recognize and respond safely",
    color: "#F6C1D1"
  },
  { 
    level_number: 2, 
    title: "Online Harassment", 
    subtitle: "Boundaries and seeking help",
    color: "#C9B7E2"
  },
  { 
    level_number: 3, 
    title: "Digital Safety", 
    subtitle: "Complete protection strategies",
    color: "#CFE7F5"
  },
];

// Random safety tips that change on each visit
const SAFETY_TIPS = [
  "If a conversation feels unsafe, stop and talk to a trusted adult.",
  "Never share personal information like your address or phone number online.",
  "Think before you post - once online, it's hard to take back.",
  "Block and report anyone who makes you feel uncomfortable.",
  "Use strong passwords and don't share them with anyone.",
  "Be kind online - treat others how you want to be treated.",
  "If someone asks to meet in person, always tell an adult first.",
  "Keep your social media accounts private and only accept friend requests from people you know.",
  "Screenshots can be saved forever - be careful what you share.",
  "Trust your instincts - if something feels wrong, it probably is."
];

// Helper function to get random safety tip
function getRandomSafetyTip() {
  const randomIndex = Math.floor(Math.random() * SAFETY_TIPS.length);
  return SAFETY_TIPS[randomIndex];
}

// Helper function to get initial student data
function getInitialStudent() {
  const savedStudent = localStorage.getItem('besafe_student');
  
  if (savedStudent) {
    return JSON.parse(savedStudent);
  }
  
  // Create default student
  const defaultStudent = {
    name: "Guest",
    points: 0,
    streak: 0,
    coins: 0,
    currentLevel: 1,
    completedLevels: 0,
  };
  localStorage.setItem('besafe_student', JSON.stringify(defaultStudent));
  return defaultStudent;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showSafetyTip, setShowSafetyTip] = useState(true);
  
  // Initialize student state with function to avoid effect warning
  const [student] = useState(() => getInitialStudent());
  
  // Get random safety tip on component mount
  const [safetyTip] = useState(() => getRandomSafetyTip());

  const levels = useMemo(() => LEVELS_CONFIG, []);

  // Loading timer only
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // Handle level click - navigate to game if unlocked
  const handleLevelClick = useCallback((level) => {
    if (level.level_number <= student?.currentLevel) {
      navigate(`/play?level=${level.level_number}`);
    }
  }, [navigate, student]);

  // Close safety tip message
  const closeSafetyTip = useCallback(() => {
    setShowSafetyTip(false);
  }, []);

  // Show loading screen
  if (loading || !student) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
        <p className={styles.loadingText}>Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Fixed Header with student stats */}
      <Header 
        points={student.points}
        streak={student.streak}
      />

      {/* Safety Tip Message (dismissible) - with random tip */}
      {showSafetyTip && (
        <div className={styles.safetyTipMessage}>
          <button 
            className={styles.tipCloseBtn}
            onClick={closeSafetyTip}
            type="button"
            aria-label="Close tip"
          >
            <X size={20} />
          </button>
          <div className={styles.tipContent}>
            <div className={styles.tipIcon}>
              <Shield size={24} />
            </div>
            <div className={styles.tipTextContent}>
              <span className={styles.tipTitle}>Safety Tip</span>
              <p className={styles.tipText}>
                {safetyTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className={styles.backgroundWrapper}>
        <div className={styles.gradientOverlay} />
        <div className={`${styles.floatingOrb} ${styles.orbPink}`} />
        <div className={`${styles.floatingOrb} ${styles.orbPurple}`} />
        <div className={`${styles.floatingOrb} ${styles.orbBlue}`} />
        
        {/* Floating safety icons */}
        <div className={`${styles.floatingIcon} ${styles.icon1}`}>
          <ShieldCheck size={40} strokeWidth={1.5} />
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon2}`}>
          <Lock size={36} strokeWidth={1.5} />
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon3}`}>
          <Shield size={42} strokeWidth={1.5} />
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon4}`}>
          <MessageCircle size={38} strokeWidth={1.5} />
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon5}`}>
          <Users size={36} strokeWidth={1.5} />
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon6}`}>
          <Heart size={34} strokeWidth={1.5} />
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon7}`}>
          <Help size={36} strokeWidth={1.5} />
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon8}`}>
          <Award size={34} strokeWidth={1.5} />
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Welcome Card */}
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeGradientBg}>
            <div className={styles.welcomeDecorTop}>
              <div className={styles.decorCircle1}></div>
              <div className={styles.decorCircle2}></div>
            </div>
            
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeIconStatic}>
                <Star size={32} className={styles.starMainIcon} />
              </div>
              
              <h2 className={styles.welcomeTitle}>
                Welcome back, {student.name}! 💜
              </h2>
              
              <p className={styles.welcomeSubtitle}>
                Keep doing amazing! Keep learning & stay safe online
              </p>

              {/* Current level badge */}
              <div className={styles.levelBadgeBox}>
                <div className={styles.levelBadgeContent}>
                  <div className={styles.levelIconWrapper}>
                    <Award size={20} />
                  </div>
                  <div className={styles.levelTextInfo}>
                    <span className={styles.levelNumber}>Level {student.currentLevel}</span>
                    <span className={styles.levelStatus}>{student.completedLevels} lessons completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Journey Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Your Learning Journey</h3>
              <p className={styles.sectionSubtitle}>
                Progress through each level to master digital safety
              </p>
            </div>
          </div>

          {/* Journey Path with levels */}
          <div className={styles.journeyContainer}>
            <div className={styles.journeyLine} />

            <div className={styles.journeyList}>
              {levels.map((level, idx) => {
                // Determine level status
                const isCompleted = level.level_number < student.currentLevel;
                const isCurrent = level.level_number === student.currentLevel;
                const isLocked = level.level_number > student.currentLevel;
                const isLeft = idx % 2 === 0;

                return (
                  <div
                    key={level.level_number}
                    className={`${styles.journeyRow} ${isLeft ? styles.rowLeft : styles.rowRight}`}
                  >
                    {/* Level Card */}
                    <div className={styles.journeyCardWrapper}>
                      <button
                        onClick={() => handleLevelClick(level)}
                        disabled={isLocked}
                        className={`${styles.journeyCard} ${
                          isLocked ? styles.cardLocked : ''
                        } ${isCurrent ? styles.cardCurrent : ''} ${
                          isCompleted ? styles.cardCompleted : ''
                        }`}
                        type="button"
                      >
                        <div className={styles.cardHeader}>
                          <div 
                            className={styles.levelBadge}
                            style={{ background: level.color }}
                          >
                            {level.level_number}
                          </div>
                          <div>
                            {isCompleted && (
                              <span className={styles.statusCompleted}>✓ Completed</span>
                            )}
                            {isCurrent && (
                              <span className={styles.statusCurrent}>In Progress</span>
                            )}
                            {isLocked && (
                              <span className={styles.statusLocked}>🔒 Locked</span>
                            )}
                          </div>
                        </div>
                        <h4 className={styles.levelTitle}>{level.title}</h4>
                        <p className={styles.levelSubtitle}>{level.subtitle}</p>
                        <div className={styles.cardFooter}>
                          {isLocked ? (
                            <span className={styles.lockedText}>
                              Complete previous level to unlock
                            </span>
                          ) : (
                            <span className={styles.startText}>
                              {isCompleted ? "Review" : "Start"} Level
                              <ArrowRight size={16} />
                            </span>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Center Node Circle */}
                    <div className={styles.journeyNodeWrapper}>
                      <div
                        className={`${styles.journeyNode} ${
                          isCompleted ? styles.nodeCompleted : ''
                        } ${isCurrent ? styles.nodeCurrent : ''} ${
                          isLocked ? styles.nodeLocked : ''
                        }`}
                      >
                        {isCompleted ? "✓" : level.level_number}
                      </div>
                    </div>

                    <div className={styles.journeySpacer} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
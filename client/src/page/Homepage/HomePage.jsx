import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
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
import styles from "./HomePage.module.css";

// Game levels configuration
const LEVELS_CONFIG = [
  {
    level_number: 1,
    title: "Cyberbullying",
    subtitle: "Recognize and respond safely",
    color: "#F6C1D1",
  },
  {
    level_number: 2,
    title: "Online Harassment",
    subtitle: "Boundaries and seeking help",
    color: "#C9B7E2",
  },
  {
    level_number: 3,
    title: "Digital Safety",
    subtitle: "Complete protection strategies",
    color: "#CFE7F5",
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
  "Trust your instincts - if something feels wrong, it probably is.",
];

// Helper function to get random safety tip
function getRandomSafetyTip() {
  const randomIndex = Math.floor(Math.random() * SAFETY_TIPS.length);
  return SAFETY_TIPS[randomIndex];
}

// Helper function to get initial student data
function getInitialStudent() {
  try {
    const savedStudent = localStorage.getItem("besafe_student");
    if (savedStudent) return JSON.parse(savedStudent);

    const defaultStudent = {
      name: "Guest",
      points: 0,
      streak: 0,
      coins: 0,
      currentLevel: 1,
      completedLevels: 0,
    };

    localStorage.setItem("besafe_student", JSON.stringify(defaultStudent));
    return defaultStudent;
  } catch {
    return {
      name: "Guest",
      points: 0,
      streak: 0,
      coins: 0,
      currentLevel: 1,
      completedLevels: 0,
    };
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const [showSafetyTip, setShowSafetyTip] = useState(true);

  // Initialize student state with function to avoid effect warning
  const [student] = useState(() => getInitialStudent());

  // Get random safety tip on component mount
  const [safetyTip] = useState(() => getRandomSafetyTip());

  const levels = useMemo(() => LEVELS_CONFIG, []);

  // Handle level click - navigate to game if unlocked
  const handleLevelClick = useCallback(
    (level) => {
      if (level.level_number <= student?.currentLevel) {
        navigate("/spot-game");
      }
    },
    [navigate, student]
  );

  // Close safety tip message
  const closeSafetyTip = useCallback(() => {
    setShowSafetyTip(false);
  }, []);

  return (
    <div className={styles.container}>
      <Header points={student.points} streak={student.streak} />

      {showSafetyTip && (
        <div className={styles.safetyTipMessage}>
          <button
            className={styles.tipCloseBtn}
            onClick={closeSafetyTip}
            type="button"
            aria-label="Close tip"
          >
            <X size={18} />
          </button>

          <div className={styles.tipContent}>
            <div className={styles.tipIcon}>
              <Shield size={24} />
            </div>
            <div className={styles.tipTextContent}>
              <span className={styles.tipTitle}>Safety Tip</span>
              <p className={styles.tipText}>{safetyTip}</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.backgroundWrapper}>
        <div className={styles.gradientOverlay} />
        <div className={`${styles.floatingOrb} ${styles.orbPink}`} />
        <div className={`${styles.floatingOrb} ${styles.orbPurple}`} />
        <div className={`${styles.floatingOrb} ${styles.orbBlue}`} />

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

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeGradientBg}>
            <div className={styles.welcomeDecorTop}>
              <div className={styles.decorCircle1}></div>
              <div className={styles.decorCircle2}></div>
            </div>

            <div className={styles.achievementBadges}>
              <div className={styles.floatingBadge1}>⭐</div>
              <div className={styles.floatingBadge2}>🏆</div>
              <div className={styles.floatingBadge3}>🎯</div>
            </div>

            <div className={styles.welcomeContent}>
              <div className={styles.illustrations}>
                <div className={styles.illustrationLeft}>
                  <div className={styles.sparkle1}>✨</div>
                  <div className={styles.sparkle2}>💫</div>
                  <div className={styles.heart1}>💜</div>
                </div>
                <div className={styles.illustrationRight}>
                  <div className={styles.star1}>⭐</div>
                  <div className={styles.star2}>🌟</div>
                  <div className={styles.flower1}>🌸</div>
                </div>
              </div>

              <div className={styles.welcomeIconStatic}>
                <Star size={32} className={styles.starMainIcon} />
              </div>

              <h2 className={styles.welcomeTitle}>Welcome , {student.name}! 💜</h2>

              <p className={styles.welcomeSubtitle}>
                Keep doing amazing! Keep learning & stay safe online
              </p>

              <div className={styles.levelBadgeBox}>
                <div className={styles.levelBadgeContent}>
                  <div className={styles.levelIconWrapper}>
                    <Award size={20} />
                  </div>
                  <div className={styles.levelTextInfo}>
                    <span className={styles.levelNumber}>Level {student.currentLevel}</span>
                    <span className={styles.levelStatus}>
                      {student.currentLevel === 1 && "Cyberbullying Basics"}
                      {student.currentLevel === 2 && "Harassment Prevention"}
                      {student.currentLevel === 3 && "Digital Safety Master"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.characterSection}>
                <div className={styles.characterBubble}>
                  <div className={styles.bubbleText}>You&apos;re doing great girl !</div>
                </div>
                <div className={styles.decorativeElements}>
                  <span className={styles.miniIcon1}>🎀</span>
                  <span className={styles.miniIcon2}>💝</span>
                  <span className={styles.miniIcon3}>🦋</span>
                </div>
              </div>

              <div className={styles.bottomDecor}>
                <span className={styles.decorIcon}>🌈</span>
                <span className={styles.decorIcon}>✨</span>
                <span className={styles.decorIcon}>🌺</span>
                <span className={styles.decorIcon}>💖</span>
                <span className={styles.decorIcon}>🦄</span>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Your Learning Journey</h3>
              <p className={styles.sectionSubtitle}>
                Progress through each level to master digital safety
              </p>
            </div>
          </div>

          <div className={styles.journeyContainer}>
            <div className={styles.journeyLine} />

            <div className={styles.journeyList}>
              {levels.map((level, idx) => {
                const isCompleted = level.level_number < student.currentLevel;
                const isCurrent = level.level_number === student.currentLevel;
                const isLocked = level.level_number > student.currentLevel;
                const isLeft = idx % 2 === 0;

                return (
                  <div
                    key={level.level_number}
                    className={`${styles.journeyRow} ${isLeft ? styles.rowLeft : styles.rowRight}`}
                  >
                    <div className={styles.journeyCardWrapper}>
                      <button
                        onClick={() => handleLevelClick(level)}
                        disabled={isLocked}
                        className={`${styles.journeyCard} ${isLocked ? styles.cardLocked : ""} ${isCurrent ? styles.cardCurrent : ""
                          } ${isCompleted ? styles.cardCompleted : ""}`}
                        type="button"
                      >
                        <div className={styles.cardHeader}>
                          <div className={styles.levelBadge} style={{ background: level.color }}>
                            {level.level_number}
                          </div>
                          <div>
                            {isCompleted && <span className={styles.statusCompleted}>✓ Completed</span>}
                            {isCurrent && <span className={styles.statusCurrent}>In Progress</span>}
                            {isLocked && <span className={styles.statusLocked}>🔒 Locked</span>}
                          </div>
                        </div>

                        <h4 className={styles.levelTitle}>{level.title}</h4>
                        <p className={styles.levelSubtitle}>{level.subtitle}</p>

                        <div className={styles.cardFooter}>
                          {isLocked ? (
                            <span className={styles.lockedText}>Complete previous level to unlock</span>
                          ) : (
                            <span className={styles.startText}>
                              {isCompleted ? "Review" : "Start"} Level <ArrowRight size={16} />
                            </span>
                          )}
                        </div>
                      </button>
                    </div>

                    <div className={styles.journeyNodeWrapper}>
                      <div
                        className={`${styles.journeyNode} ${isCompleted ? styles.nodeCompleted : ""} ${isCurrent ? styles.nodeCurrent : ""
                          } ${isLocked ? styles.nodeLocked : ""}`}
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

      <BottomNav />
    </div>
  );
}
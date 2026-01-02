import { useMemo, useState, useCallback, useEffect } from "react";
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
import LanguageSwitcher from "../../components/translations/LanguageSwitcher.jsx";
import { translations, getRandomSafetyTip } from "../../components/translations/translations.js";
import styles from "./HomePage.module.css";
// Game levels configuration
const LEVELS_CONFIG = [
  {
    level_number: 1,
    color: "#F6C1D1",
  },
  {
    level_number: 2,
    color: "#C9B7E2",
  },
  {
    level_number: 3,
    color: "#CFE7F5",
  },
];

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

// Get saved language or default to English
function getInitialLanguage() {
  try {
    return localStorage.getItem("besafe_language") || "en";
  } catch {
    return "en";
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const [showSafetyTip, setShowSafetyTip] = useState(true);
  const [currentLang, setCurrentLang] = useState(getInitialLanguage);

  // Initialize student state with function to avoid effect warning
  const [student] = useState(() => getInitialStudent());

  // Get random safety tip based on current language
  const [safetyTip, setSafetyTip] = useState(() => getRandomSafetyTip(currentLang));

  const levels = useMemo(() => LEVELS_CONFIG, []);
  const t = translations[currentLang] || translations.en;

  // Update safety tip when language changes
  useEffect(() => {
    setSafetyTip(getRandomSafetyTip(currentLang));
  }, [currentLang]);

  // Handle language change
  const handleLanguageChange = useCallback((newLang) => {
    setCurrentLang(newLang);
    try {
      localStorage.setItem("besafe_language", newLang);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
    
    // Update document direction for RTL languages
    document.documentElement.dir = newLang === 'he' || newLang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Set initial document direction
  useEffect(() => {
    document.documentElement.dir = currentLang === 'he' || currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

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

  // Get level status text
  const getLevelStatusText = (levelNum) => {
    if (levelNum === 1) return t.cyberbullyingBasics;
    if (levelNum === 2) return t.harassmentPrevention;
    if (levelNum === 3) return t.digitalSafetyMaster;
    return '';
  };

  return (
    <div className={styles.container}>
      <Header 
        points={student.points} 
        streak={student.streak}
        lang={currentLang}
      />

      {/* Language Switcher - Positioned in top right */}
      <div className={styles.languageSwitcherWrapper}>
        <LanguageSwitcher
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />
      </div>

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
              <span className={styles.tipTitle}>{t.safetyTip}</span>
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

              <h2 className={styles.welcomeTitle}>
                {t.welcome}, {student.name}! 💜
              </h2>

              <p className={styles.welcomeSubtitle}>
                {t.keepDoingAmazing}
              </p>

              <div className={styles.levelBadgeBox}>
                <div className={styles.levelBadgeContent}>
                  <div className={styles.levelIconWrapper}>
                    <Award size={20} />
                  </div>
                  <div className={styles.levelTextInfo}>
                    <span className={styles.levelNumber}>
                      {t.level} {student.currentLevel}
                    </span>
                    <span className={styles.levelStatus}>
                      {getLevelStatusText(student.currentLevel)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.characterSection}>
                <div className={styles.characterBubble}>
                  <div className={styles.bubbleText}>{t.youreDoingGreat}</div>
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
              <h3 className={styles.sectionTitle}>{t.yourLearningJourney}</h3>
              <p className={styles.sectionSubtitle}>
                {t.progressThrough}
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
                
                const levelData = t.levels[idx];

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
                            {isCompleted && <span className={styles.statusCompleted}>{t.completed}</span>}
                            {isCurrent && <span className={styles.statusCurrent}>{t.inProgress}</span>}
                            {isLocked && <span className={styles.statusLocked}>{t.locked}</span>}
                          </div>
                        </div>

                        <h4 className={styles.levelTitle}>{levelData.title}</h4>
                        <p className={styles.levelSubtitle}>{levelData.subtitle}</p>

                        <div className={styles.cardFooter}>
                          {isLocked ? (
                            <span className={styles.lockedText}>{t.completePrevious}</span>
                          ) : (
                            <span className={styles.startText}>
                              {isCompleted ? t.reviewLevel : t.startLevel} {t.level} <ArrowRight size={16} />
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

      <BottomNav lang={currentLang} />
    </div>
  );
}
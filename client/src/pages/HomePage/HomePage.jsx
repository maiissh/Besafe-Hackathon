import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Loader2,
  ShieldCheck,
  MessageCircle,
  Users,
  ArrowRight,
  Home,
  Gamepad2,
  HelpCircle,
  X,
  Shield,
  Flame,
  Coins,
  Star,
  Lock,
  Heart,
  Zap,
  Award,
  CheckCircle,
  HelpCircle as Help,
  Target,
} from "lucide-react";
import styles from "./Home.module.css";

// Configuration constants
const LOADING_DURATION = 650;
const MAX_LEVELS = 3;

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

const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/chat", label: "Chat", Icon: MessageCircle },
  { to: "/stories", label: "Stories", Icon: Users },
  { to: "/help", label: "Help", Icon: HelpCircle },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showSafetyTip, setShowSafetyTip] = useState(true);

  // Mock student data - replace with backend integration
  const student = useMemo(
    () => ({
      name: "Mais",
      points: 120,
      streak: 5,
      currentLevel: 2,
      completedLevels: 1,
    }),
    []
  );

  const levels = useMemo(() => LEVELS_CONFIG, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const handleLevelClick = useCallback((level) => {
    if (level.level_number <= student.currentLevel) {
      navigate(`/play?level=${level.level_number}`);
    }
  }, [navigate, student.currentLevel]);

  const progressPercent = useMemo(() => {
    const total = MAX_LEVELS;
    const completed = Math.min(student.completedLevels, total);
    return Math.round((completed / total) * 100);
  }, [student.completedLevels]);

  const isActive = useCallback((to) => location.pathname === to, [location.pathname]);

  const closeSafetyTip = useCallback(() => {
    setShowSafetyTip(false);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
        <p className={styles.loadingText}>Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Safety Tip Message - Top Right */}
      {showSafetyTip && (
        <div className={styles.safetyTipMessage}>
          <button 
            className={styles.tipCloseBtn}
            onClick={closeSafetyTip}
            type="button"
            aria-label="Close tip"
          >
            <X size={16} />
          </button>
          <div className={styles.tipContent}>
            <div className={styles.tipIcon}>
              <Shield size={18} />
            </div>
            <div className={styles.tipTextContent}>
              <span className={styles.tipTitle}>Safety Tip</span>
              <p className={styles.tipText}>
                If a conversation feels unsafe, stop and talk to a trusted adult.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background with Safety-Related Icons */}
      <div className={styles.backgroundWrapper}>
        <div className={styles.gradientOverlay} />
        <div className={`${styles.floatingOrb} ${styles.orbPink}`} />
        <div className={`${styles.floatingOrb} ${styles.orbPurple}`} />
        <div className={`${styles.floatingOrb} ${styles.orbBlue}`} />
        
        {/* Safety & Internet icons - spread apart */}
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
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.branding}>
              <h1 className={styles.brandTitle}>BeSafe</h1>
              <p className={styles.brandSubtitle}>School Guided Online Safety</p>
            </div>
            
            {/* Streak & Points Badges - Back on top, bigger */}
            <div className={styles.badgesGroup}>
              <div className={styles.streakBadge}>
                <Flame className={styles.flameIcon} size={22} />
                <span className={styles.badgeValue}>{student.streak}</span>
              </div>
              <div className={styles.pointsBadge}>
                <Coins className={styles.coinsIcon} size={22} />
                <span className={styles.badgeValue}>{student.points}</span>
              </div>
            </div>
          </div>

          {/* Welcome Card - More Beautiful & Elegant */}
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

                {/* Level Badge only */}
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
        </header>

        {/* Journey Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Your Learning Journey</h3>
              <p className={styles.sectionSubtitle}>
                Progress through each level to master digital safety
              </p>
            </div>
          </div>

          {/* Journey Path */}
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

                    {/* Center Node */}
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

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <div className={styles.navContainer}>
          {NAV_ITEMS.map(({ to, label, Icon }) => {
            const active = isActive(to);
            return (
              <button
                key={to}
                onClick={() => navigate(to)}
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                type="button"
              >
                <Icon size={20} />
                <span className={styles.navLabel}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
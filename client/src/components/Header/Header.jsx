import { Flame, Coins } from "lucide-react";
import styles from "./Header.module.css";

export default function Header({ studentName, points, streak }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.branding}>
          <h1 className={styles.brandTitle}>BeSafe</h1>
          <p className={styles.brandSubtitle}>School Guided Online Safety</p>
        </div>
        
        {/* Streak & Points Badges */}
        <div className={styles.badgesGroup}>
          <div className={styles.streakBadge}>
            <Flame className={styles.flameIcon} size={22} />
            <span className={styles.badgeValue}>{streak}</span>
          </div>
          <div className={styles.pointsBadge}>
            <Coins className={styles.coinsIcon} size={22} />
            <span className={styles.badgeValue}>{points}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
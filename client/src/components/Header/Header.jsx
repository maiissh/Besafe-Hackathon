import PropTypes from 'prop-types';
import { Flame, Coins } from "lucide-react";
import styles from "./Header.module.css";

export default function Header({ /*studentName,*/ points, streak }) {
  const handleBeSafeClick = () => {
    window.location.href = "/homepage";
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.branding}>
          <h1 
            className={styles.brandTitle}
            onClick={handleBeSafeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleBeSafeClick();
              }
            }}
            aria-label="Go to homepage"
          >
            BeSafe
          </h1>
          <p className={styles.brandSubtitle}>School Guided Online Safety</p>
        </div>

        {/* Streak & Points */}
        <div className={styles.badgesGroup}>
          <div className={styles.streakBadge}>
            <Flame className={styles.flameIcon} size={28} />
            <span className={styles.badgeValue}>{streak}</span>
          </div>

          <div className={styles.pointsBadge}>
            <Coins className={styles.coinsIcon} size={28} />
            <span className={styles.badgeValue}>{points}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  studentName: PropTypes.string,
  points: PropTypes.number.isRequired,
  streak: PropTypes.number.isRequired,
};

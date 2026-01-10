import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageCircle, Users, HelpCircle } from "lucide-react";
import styles from "./BottomNav.module.css";

const NAV_ITEMS = [
  { to: "/homepage", label: "Home", Icon: Home },
  { to: "/serena-chat", label: "Chat", Icon: MessageCircle },
  { to: "/Stories", label: "Stories", Icon: Users },
  { to: "/help", label: "Help", Icon: HelpCircle },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to) => location.pathname === to;

  return (
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
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} />
              <span className={styles.navLabel}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
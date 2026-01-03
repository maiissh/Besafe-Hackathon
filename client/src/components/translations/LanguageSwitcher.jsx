import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Globe } from 'lucide-react';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
];

function LanguageSwitcher({ currentLang = 'en', onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageSelect = (langCode) => {
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSwitcher} ref={dropdownRef}>
      <button
        className={styles.langButton}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Switch language"
        aria-expanded={isOpen}
      >
        <Globe size={22} className={styles.globeIcon} />
        <span className={styles.currentLang}>
          <span className={styles.flag}>{currentLanguage.flag}</span>
        </span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <Globe size={16} />
            <span>Choose Language</span>
          </div>
          <div className={styles.languageList}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`${styles.langOption} ${
                  lang.code === currentLang ? styles.langOptionActive : ''
                }`}
                onClick={() => handleLanguageSelect(lang.code)}
                type="button"
              >
                <span className={styles.optionFlag}>{lang.flag}</span>
                <div className={styles.optionText}>
                  <span className={styles.optionNative}>{lang.nativeName}</span>
                  <span className={styles.optionEnglish}>{lang.name}</span>
                </div>
                {lang.code === currentLang && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

LanguageSwitcher.propTypes = {
  currentLang: PropTypes.string,
  onLanguageChange: PropTypes.func,
};

LanguageSwitcher.defaultProps = {
  currentLang: 'en',
  onLanguageChange: null,
};

export default LanguageSwitcher;
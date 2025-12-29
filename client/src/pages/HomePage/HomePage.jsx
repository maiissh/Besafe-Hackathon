import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, BookHeart, Sparkles, Lightbulb, Star } from 'lucide-react';

import styles from './Home.module.css';

// استيراد المكونات
import StatsHeader from '../../components/common/home/statsHeader';
import LevelPath from '../../components/common/home/levelPath';
import QuickActions from '../../components/common/home/QuickActions';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // بيانات وهمية بسيطة جداً لضمان العرض
  const student = { full_name: "ميس", points: 100, current_level: 1 };
  const levels = [{ level_number: 1, title: "البداية" }, { level_number: 2, title: "التحدي" }];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // دالة تنقل بسيطة لا تعتمد على utils
  const handleLevelClick = (lvl) => {
    navigate(`/play?level=${lvl.level_number}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F9]">
      <Loader2 className="animate-spin" size={40} color="#E7B6D1" />
    </div>
  );

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.magicBackground}>
        <div className={`${styles.lightBlob} ${styles.pinkBlob}`} />
        <div className={`${styles.lightBlob} ${styles.purpleBlob}`} />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        <div className={styles.glassCard}>
          <StatsHeader student={student} />
        </div>
        
        <div className="py-8">
          {/* تأكدي أن LevelPath لا يستخدم createPageUrl داخله */}
          <LevelPath 
            levels={levels} 
            student={student} 
            onLevelClick={handleLevelClick} 
          />
        </div>

        <div className={styles.actionSection}>
          <QuickActions />
        </div>
      </main>
    </div>
  );
}
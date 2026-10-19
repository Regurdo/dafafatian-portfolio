'use client';

import { useLanguage } from './LanguageProvider';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-8 w-16 rounded-full opacity-0 ${className}`} />
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`relative inline-flex items-center rounded-full p-0.5 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-[10px] font-mono ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('id')}
        className={`relative z-10 px-2 py-1 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${
          language === 'id'
            ? 'text-neutral-900 dark:text-white font-bold'
            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
        }`}
        aria-label="Ganti ke Bahasa Indonesia"
        aria-pressed={language === 'id'}
      >
        {language === 'id' && (
          <motion.span
            layoutId="lang-active-pill"
            className="absolute inset-0 rounded-full bg-white dark:bg-neutral-800 shadow-xs border border-black/[0.06] dark:border-white/[0.08]"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">ID</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative z-10 px-2 py-1 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${
          language === 'en'
            ? 'text-neutral-900 dark:text-white font-bold'
            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
        }`}
        aria-label="Switch to English"
        aria-pressed={language === 'en'}
      >
        {language === 'en' && (
          <motion.span
            layoutId="lang-active-pill"
            className="absolute inset-0 rounded-full bg-white dark:bg-neutral-800 shadow-xs border border-black/[0.06] dark:border-white/[0.08]"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
    </div>
  );
}

'use client';

import { useTheme } from './ThemeProvider';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder dengan ukuran yang sama agar tidak terjadi layout shift saat hydration
    return (
      <div className={`w-9 h-9 rounded-full flex items-center justify-center opacity-0 ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.88 }}
      aria-label={isDark ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
      title={isDark ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
        isDark
          ? 'text-neutral-300 hover:text-white hover:bg-white/10'
          : 'text-neutral-700 hover:text-black hover:bg-black/5'
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun size={17} className="transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon size={17} className="transition-transform duration-300 hover:-rotate-12" />
        )}
      </motion.div>
    </motion.button>
  );
}

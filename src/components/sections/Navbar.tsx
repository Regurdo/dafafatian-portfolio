'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { scrollToSection, scrollToTop } from '@/components/SmoothScroll';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/components/LanguageProvider';

export default function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  const navItems = [
    { id: 'about', label: t.nav.about, href: '#about' },
    { id: 'projects', label: t.nav.projects, href: '#projects' },
    { id: 'skills', label: t.nav.skills, href: '#skills' },
    { id: 'experience', label: t.nav.experience, href: '#experience' },
    { id: 'contact', label: t.nav.contact, href: '#contact' },
  ];

  // Scrollspy — highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    navItems.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    setActiveSection(href);
    scrollToSection(href);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <motion.div
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`relative flex w-full max-w-2xl items-center justify-between gap-3 rounded-full py-2.5 pl-6 pr-2.5 transition-all duration-500 ${
          scrolled || mobileOpen
            ? 'border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-[#0a0a0a]/70 shadow-2xl shadow-black/5 dark:shadow-black/50 backdrop-blur-xl'
            : 'border border-transparent'
        }`}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMobileOpen(false);
            setActiveSection('');
            scrollToTop();
          }}
          className="group relative shrink-0 text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          DAFA
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
        </a>

        {/* Desktop nav — sliding pill indicator follows hover & active section */}
        <div
          className="relative hidden items-center gap-1 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {navItems.map((item) => {
            const pillHere = (hovered ?? activeSection) === item.href;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                onMouseEnter={() => setHovered(item.href)}
                className={`relative rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
                  pillHere
                    ? 'text-white dark:text-black'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {pillHere && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.55 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Right side: Language Switcher, Theme Switcher & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-900 dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-neutral-900 dark:bg-white transition-all duration-300 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-neutral-900 dark:bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-neutral-900 dark:bg-white transition-all duration-300 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-x-0 top-[calc(100%+8px)] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/95 dark:bg-[#0a0a0a]/95 p-3 shadow-2xl shadow-black/10 dark:shadow-black/50 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href;
                  return (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.25 }}
                      className={`rounded-2xl px-4 py-3 text-sm uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-black/5 dark:bg-white/10 text-neutral-900 dark:text-white font-medium'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {item.label}
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}

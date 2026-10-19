'use client';
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { countRows } from '@/lib/admin-queries';
import { ToastProvider } from './ui';

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/photography', label: 'Photography' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/experience', label: 'Experience' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/profile', label: 'Profile' },
];

/** Halaman lain memanggil ini setelah mengubah status baca pesan */
export const MESSAGES_CHANGED = 'admin:messages-changed';

export default function AdminShell({
  children,
  email,
  onSignOut,
}: {
  children: ReactNode;
  email: string;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
  const activeHref = NAV.find((n) => isActive(n.href))?.href ?? '';

  useEffect(() => {
    const load = () =>
      countRows('messages', { column: 'is_read', value: false }).then(setUnread);
    load();
    window.addEventListener(MESSAGES_CHANGED, load);
    return () => window.removeEventListener(MESSAGES_CHANGED, load);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <ToastProvider>
      <div className="grain-overlay" />
      <div className="vignette" />

      <nav className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`relative flex w-full max-w-4xl items-center justify-between gap-3 rounded-full py-2.5 pl-6 pr-2.5 transition-all duration-500 ${
            scrolled || mobileOpen
              ? 'border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-[#0a0a0a]/70 shadow-2xl shadow-black/5 dark:shadow-black/50 backdrop-blur-xl'
              : 'border border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-[#0a0a0a]/40 backdrop-blur-md'
          }`}
        >
          <Link
            href="/admin"
            className="group relative shrink-0 text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            DAFA
            <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">
              Admin
            </span>
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop nav — pill indikator yang sama dengan navbar portfolio */}
          <div
            className="relative hidden items-center gap-1 xl:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV.map((item) => {
              const pillHere = (hovered ?? activeHref) === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  className={`relative rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
                    pillHere
                      ? 'text-white dark:text-black'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {pillHere && (
                    <motion.span
                      layoutId="admin-nav-pill"
                      className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.55 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    {item.href === '/admin/messages' && unread > 0 && (
                      <span className="rounded-full bg-red-500 px-1.5 text-[9px] font-bold leading-4 text-white">
                        {unread}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              target="_blank"
              aria-label="Lihat situs"
              title="Lihat situs"
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ExternalLink size={16} />
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={onSignOut}
              aria-label="Keluar"
              title={`Keluar (${email})`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              <LogOut size={16} />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-900 dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10 xl:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-5 bg-neutral-900 dark:bg-white transition-all duration-300 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`block h-0.5 w-5 bg-neutral-900 dark:bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 bg-neutral-900 dark:bg-white transition-all duration-300 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
              </div>
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-x-0 top-[calc(100%+8px)] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/95 dark:bg-[#0a0a0a]/95 p-3 shadow-2xl shadow-black/10 dark:shadow-black/50 backdrop-blur-xl xl:hidden"
              >
                <div className="flex flex-col">
                  {NAV.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm uppercase tracking-wider transition-colors ${
                          isActive(item.href)
                            ? 'bg-black/5 dark:bg-white/10 text-neutral-900 dark:text-white font-medium'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {item.label}
                        {item.href === '/admin/messages' && unread > 0 && (
                          <span className="rounded-full bg-red-500 px-2 text-[10px] font-bold leading-5 text-white">
                            {unread}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">{children}</main>
    </ToastProvider>
  );
}

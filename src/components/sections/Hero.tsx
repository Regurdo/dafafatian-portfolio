'use client';
import { motion } from 'motion/react';
import { Profile } from '@/lib/supabase';
import ImageTrail from '@/components/reactbits/ImageTrail';
import { useLanguage } from '@/components/LanguageProvider';

const HERO_TRAIL_IMAGES = [
  '/trail/trail-1.webp',
  '/trail/trail-2.webp',
  '/trail/trail-3.webp',
  '/trail/trail-4.webp',
  '/trail/trail-5.webp',
  '/trail/trail-6.webp',
  '/trail/trail-7.webp',
  '/trail/trail-8.webp',
  '/trail/trail-9.webp',
];

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Interactive Cursor Image Trail - Strictly isolated overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden" aria-hidden="true">
        <ImageTrail
          items={HERO_TRAIL_IMAGES}
          size={160}
          aspectRatio={4 / 3}
          radius={14}
          threshold={75}
          appearScale={0.25}
          zoom={1.6}
          flash={0.3}
          lifetime={0.35}
          stack={4}
          rotation={12}
          tilt={8}
          sizeVariance={0.2}
        />
      </div>

      {/* Main Content - Sole in-flow flex child, centered horizontally & vertically */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pointer-events-auto">
        {/* Top row: Intro (left) + Status (right) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 mb-10 md:mb-14"
        >
          {/* Left: Intro / Bio */}
          <p className="max-w-lg text-neutral-600 dark:text-neutral-400 text-lg md:text-xl leading-relaxed font-normal">
            {t.hero.bio}
          </p>

          {/* Right: Status + Scroll hint */}
          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
            <span className="text-neutral-800 dark:text-neutral-300 text-sm font-medium">
              {profile.title || t.hero.title}
            </span>
            <span className="text-neutral-500 text-sm">{t.hero.status}</span>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[11px] tracking-[0.2em] uppercase font-medium text-neutral-500">
                {t.hero.scroll}
              </span>
              <div className="w-12 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
            </div>
          </div>
        </motion.div>

        {/* Giant Name */}
        <motion.h1
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="hero-name text-neutral-900 dark:text-neutral-200 uppercase"
        >
          {profile.name}
        </motion.h1>
      </div>

      {/* Custom style for hero name */}
      <style jsx global>{`
        .hero-name {
          font-size: clamp(4rem, 11vw, 13rem);
          line-height: 0.85;
          letter-spacing: -0.04em;
          font-weight: 900;
        }
      `}</style>
    </section>
  );
}

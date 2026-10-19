'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { X, ZoomIn } from 'lucide-react';
import type { PhotoItem } from '@/lib/photos';
import { fallbackPhotos } from '@/lib/photos';

/* Suara tactile klik kamera mekanis (Web Audio API synthesized) */
function playCameraClick(type: 'click' | 'shutter' = 'click') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'shutter') {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(800, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.035);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.04);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1350, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(200, now + 0.075);
      gain2.gain.setValueAtTime(0.14, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.08);
    } else {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1300, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.03);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    }
  } catch {
    // Audio suppression fallback
  }
}

export default function Photography({ photos: initialPhotos }: { photos?: PhotoItem[] } = {}) {
  const photos = initialPhotos && initialPhotos.length > 0 ? initialPhotos : fallbackPhotos;
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [index, setIndex] = useState(() => Math.min(6, Math.max(photos.length - 1, 0))); // Default foto #7 (atau terakhir jika kurang)
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [showOSD, setShowOSD] = useState(true);
  const [colorMode, setColorMode] = useState<'normal' | 'vintage' | 'bw'>('normal');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [pressedButton, setPressedButton] = useState<'left' | 'right' | 'set' | 'disp' | 'menu' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const N = photos.length;
  const currentPhoto = photos[index] ?? photos[0];

  const step = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir === 1 ? 'right' : 'left');
      setIndex((prev) => (prev + dir + N) % N);
      playCameraClick('click');
    },
    [N]
  );

  // Keyboard navigation panah kiri/kanan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
        return;
      }

      if (document.activeElement?.closest('#photography') || containerRef.current?.matches(':hover')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          step(-1);
          setPressedButton('left');
          setTimeout(() => setPressedButton(null), 200);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          step(1);
          setPressedButton('right');
          setTimeout(() => setPressedButton(null), 200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, isLightboxOpen]);

  // Parallax zigzag kinetic typography on vertical scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const x3 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const getFilterStyle = () => {
    if (colorMode === 'vintage') return 'sepia(0.35) contrast(1.1) brightness(0.95)';
    if (colorMode === 'bw') return 'grayscale(1) contrast(1.2)';
    return 'none';
  };

  if (!currentPhoto) return null;

  return (
    <section
      id="photography"
      ref={containerRef}
      className="py-32 px-6 relative overflow-hidden"
    >
      {/* ── BACKGROUND HOLLOW TEXT (KINETIC ZIGZAG PARALLAX) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden -z-10 flex flex-col justify-center gap-4 sm:gap-6"
      >
        {[
          { x: x1, key: 'row-1' },
          { x: x2, key: 'row-2' },
          { x: x3, key: 'row-3' },
        ].map(({ x: rowX, key }) => (
          <motion.div
            key={key}
            style={{ x: rowX }}
            className="whitespace-nowrap flex will-change-transform leading-none"
          >
            <span
              className="hollow-bg-text font-serif font-black uppercase tracking-[0.06em] text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] select-none pointer-events-none"
              style={{
                fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: isDark
                  ? '1.2px rgba(255, 255, 255, 0.08)'
                  : '1.2px rgba(0, 0, 0, 0.06)',
              }}
            >
              PHOTOGRAPHY &nbsp;•&nbsp; PHOTOGRAPHY &nbsp;•&nbsp; PHOTOGRAPHY &nbsp;•&nbsp; PHOTOGRAPHY &nbsp;•&nbsp; PHOTOGRAPHY &nbsp;•&nbsp; PHOTOGRAPHY
            </span>
          </motion.div>
        ))}
      </div>

      {/* Ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-black/[0.02] dark:bg-white/[0.015] rounded-full blur-3xl" />
      </div>

      {/* ── HEADER SECTION (Konsisten dengan Projects & About: Rata Kiri) ── */}
      <div className="max-w-6xl mx-auto mb-12 relative z-10">
        <AnimatedContent distance={60} duration={1}>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4 block">
            {t.photography.tag}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">
            {t.photography.title}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">
            {t.photography.description}
          </p>
        </AnimatedContent>
      </div>

      {/* ── CENTERED VINTAGE CAMERA CONTAINER ── */}
      <div className="relative max-w-[560px] sm:max-w-[620px] w-full mx-auto z-10">
        <div className="relative w-full aspect-[556/366] mx-auto select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* LAYER 1: LCD SCREEN */}
          <div
            className="absolute overflow-hidden rounded-[2px] bg-black cursor-pointer group z-0"
            style={{
              left: '8.0%',
              top: '29.2%',
              width: '55.8%',
              height: '63.6%',
            }}
            onClick={() => {
              setIsLightboxOpen(true);
              playCameraClick('shutter');
            }}
            title="Klik untuk membuka ukuran penuh (Lightbox)"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPhoto.id}
                initial={{
                  opacity: 0,
                  x: direction === 'right' ? 24 : -24,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: direction === 'right' ? -24 : 24,
                  scale: 0.98,
                }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.title}
                  draggable={false}
                  className="w-full h-full object-cover select-none"
                  style={{ filter: getFilterStyle() }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Scanline Effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 2px)',
                backgroundSize: '100% 2px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.7)] pointer-events-none" />

            {/* LCD OSD */}
            {showOSD && (
              <div className="absolute inset-0 p-2 sm:p-2.5 flex flex-col justify-between pointer-events-none font-mono text-white select-none z-10">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px]">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-xs border border-white/10">
                    <span className="text-sky-400 font-bold">▶</span>
                    <span className="tracking-wider text-neutral-300">PLAY</span>
                  </div>
                  <div className="bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-white/15 tracking-[0.2em] font-bold text-neutral-100 shadow-sm">
                    <span className="text-red-500 font-bold drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-white/50 mx-1">/</span>
                    <span>{String(N).padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center opacity-30">
                  <div className="w-10 h-10 border border-white/60 rounded-xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-center gap-1 py-0.5">
                    {photos.map((_, i) => (
                      <span
                        key={i}
                        className={`transition-all duration-300 rounded-full ${
                          i === index
                            ? 'w-1.5 h-1.5 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.85)]'
                            : 'w-1 h-1 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[8px] sm:text-[9.5px] text-white/85 bg-black/55 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-white/10">
                    <span className="truncate max-w-[55%] font-sans font-medium text-white/95">
                      {currentPhoto.title}
                    </span>
                    <span className="text-neutral-400 tracking-wider">
                      {currentPhoto.exif.shutter} • {currentPhoto.exif.aperture}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hover hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 text-white text-[10px] sm:text-xs tracking-wider uppercase border border-white/20">
                <ZoomIn size={13} /> {t.photography.fullView}
              </span>
            </div>
          </div>

          {/* LAYER 2: CAMERA BODY IMAGE */}
          <img
            src="/camera-body.png"
            alt="Canon Digital Camera Body"
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
          />

          {/* LAYER 3: DIAL BUTTON HOTSPOTS */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              step(-1);
              setPressedButton('left');
              setTimeout(() => setPressedButton(null), 200);
            }}
            aria-label="Previous Photo"
            className={`absolute rounded-full cursor-pointer z-20 transition-all duration-150 focus:outline-none -translate-x-1/2 -translate-y-1/2 ${
              pressedButton === 'left'
                ? 'scale-90 bg-white/30 ring-2 ring-neutral-300'
                : 'hover:bg-neutral-400/20 hover:ring-2 hover:ring-neutral-400'
            }`}
            style={{ left: '78.06%', top: '66.94%', width: '7.2%', aspectRatio: '1 / 1' }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              step(1);
              setPressedButton('right');
              setTimeout(() => setPressedButton(null), 200);
            }}
            aria-label="Next Photo"
            className={`absolute rounded-full cursor-pointer z-20 transition-all duration-150 focus:outline-none -translate-x-1/2 -translate-y-1/2 ${
              pressedButton === 'right'
                ? 'scale-90 bg-white/30 ring-2 ring-neutral-300'
                : 'hover:bg-neutral-400/20 hover:ring-2 hover:ring-neutral-400'
            }`}
            style={{ left: '91.73%', top: '66.94%', width: '7.2%', aspectRatio: '1 / 1' }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsLightboxOpen(true);
              playCameraClick('shutter');
            }}
            aria-label="Fullscreen (SET)"
            className="absolute rounded-full cursor-pointer z-20 transition-all duration-150 hover:bg-white/20 hover:ring-2 hover:ring-white/50 active:scale-90 focus:outline-none -translate-x-1/2 -translate-y-1/2"
            style={{ left: '83.54%', top: '66.78%', width: '7.6%', aspectRatio: '1 / 1' }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowOSD((v) => !v);
              playCameraClick('click');
            }}
            aria-label="Toggle OSD (DISP)"
            className="absolute rounded-full cursor-pointer z-20 transition-all duration-150 hover:bg-white/20 hover:ring-1 hover:ring-white/60 active:scale-90 focus:outline-none -translate-x-1/2 -translate-y-1/2"
            style={{ left: '77.18%', top: '86.35%', width: '6.2%', aspectRatio: '1 / 1' }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setColorMode((prev) =>
                prev === 'normal' ? 'vintage' : prev === 'vintage' ? 'bw' : 'normal'
              );
              playCameraClick('click');
            }}
            aria-label="Toggle Color Filter (MENU)"
            className="absolute rounded-full cursor-pointer z-20 transition-all duration-150 hover:bg-white/20 hover:ring-1 hover:ring-white/60 active:scale-90 focus:outline-none -translate-x-1/2 -translate-y-1/2"
            style={{ left: '90.41%', top: '85.83%', width: '6.2%', aspectRatio: '1 / 1' }}
          />
        </div>

        {/* Control helper */}
        <div className="mt-6 text-center flex flex-col items-center gap-2">
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm tracking-wide">
            {t.photography.instruction}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
            <button
              onClick={() => step(-1)}
              className="px-2.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.photography.leftButton}
            </button>
            <span>/</span>
            <button
              onClick={() => step(1)}
              className="px-2.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.photography.rightButton}
            </button>
            <span className="hidden sm:inline text-neutral-500">{t.photography.keyboardHint}</span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────
          LIGHTBOX MODAL (UKURAN PENUH FOTO + EXIF)
         ──────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
              aria-label={t.photography.closeLightbox}
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row gap-6 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[75vh] max-w-full overflow-hidden rounded-xl border border-white/15 shadow-2xl bg-black">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.title}
                  className="max-h-[75vh] w-auto object-contain"
                  style={{ filter: getFilterStyle() }}
                />
              </div>

              <div className="w-full md:w-80 flex flex-col gap-4 text-left p-5 rounded-xl bg-white/95 dark:bg-neutral-900/90 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white shadow-xl">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                    {currentPhoto.category}
                  </span>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                    {currentPhoto.title}
                  </h3>
                  <p className="text-xs font-mono text-red-500 font-bold mt-1">
                    {t.photography.frameOf(index + 1, N)}
                  </p>
                </div>

                <div className="border-t border-black/10 dark:border-white/10 pt-3 flex flex-col gap-2 font-mono text-xs">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>{t.photography.camera}</span>
                    <span className="text-neutral-900 dark:text-white font-medium">{currentPhoto.exif.camera}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>{t.photography.lens}</span>
                    <span className="text-neutral-900 dark:text-white font-medium">{currentPhoto.exif.lens}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>{t.photography.shutter}</span>
                    <span className="text-neutral-900 dark:text-white font-medium">{currentPhoto.exif.shutter}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>{t.photography.aperture}</span>
                    <span className="text-neutral-900 dark:text-white font-medium">{currentPhoto.exif.aperture}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>{t.photography.sensitivity}</span>
                    <span className="text-neutral-900 dark:text-white font-medium">{currentPhoto.exif.iso}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => step(-1)}
                    className="flex-1 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white/10 hover:bg-neutral-800 dark:hover:bg-white/20 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    ◀ {t.photography.prev}
                  </button>
                  <button
                    onClick={() => step(1)}
                    className="flex-1 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white/10 hover:bg-neutral-800 dark:hover:bg-white/20 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {t.photography.next} ▶
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

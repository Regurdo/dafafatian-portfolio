'use client';
import { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
} from 'motion/react';

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

function ParallaxText({ children, baseVelocity = 100, className = '' }: { children: React.ReactNode; baseVelocity?: number; className?: string }) {
  const baseX = useRef(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(() => `${wrap(-20, -45, baseX.current)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.current += moveBy;
  });

  return (
    <div className="overflow-hidden m-0 flex flex-nowrap whitespace-nowrap">
      <motion.div className={`flex flex-row flex-nowrap whitespace-nowrap font-bold text-5xl md:text-7xl uppercase select-none ${className}`} style={{ x }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="block mr-8">{children}</span>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * PingPongText — endlessly glides left ↔ right (sine-eased, smooth turnarounds).
 * Hovering a row fades the text up to a much more visible opacity.
 */
function PingPongText({
  children,
  duration = 14,
  reverse = false,
  className = '',
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef(0);
  const reducedMotionRef = useRef(false);
  // Hover-pause bookkeeping: freeze position while hovered,
  // resume from the exact same phase afterwards (no jump)
  const pausedRef = useRef(false);
  const pausedAtRef = useRef(0);
  const pausedTotalRef = useRef(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const measure = () => {
      rangeRef.current = Math.max(0, track.scrollWidth - container.clientWidth);
    };
    measure();

    // Re-measure on resize AND when font loading changes the text width
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(container);

    // Pause the animation loop while the row is off-screen — keeps the
    // GPU/CPU idle elsewhere on the page instead of animating 3 rows 24/7.
    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0].isIntersecting;
      },
      { rootMargin: '64px 0px' }
    );
    io.observe(container);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [children]);

  useAnimationFrame((t) => {
    const track = trackRef.current;
    // Skip entirely when off-screen or reduced motion is requested.
    if (!track || reducedMotionRef.current || !visibleRef.current) return;
    const range = rangeRef.current;
    if (range <= 0) return;

    // Freeze while hovered (mouseenter/mouseleave update pausedRef)
    if (pausedRef.current) {
      // Capture pause start ONCE; keep frozen until hover ends
      if (pausedAtRef.current === 0) pausedAtRef.current = t;
      return;
    }
    // Subtract the full paused interval so the wave resumes exactly where it stopped
    if (pausedAtRef.current > 0) {
      pausedTotalRef.current += t - pausedAtRef.current;
      pausedAtRef.current = 0;
    }

    // Smooth 0 → 1 → 0 wave over `duration` seconds (eases out at both edges)
    const phase = ((t - pausedTotalRef.current) / 1000 / duration) % 1;
    const wave = (1 - Math.cos(phase * Math.PI * 2)) / 2;
    const progress = reverse ? 1 - wave : wave;
    track.style.transform = `translate3d(${-range * progress}px, 0, 0)`;
  });

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden flex flex-nowrap whitespace-nowrap"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div
        ref={trackRef}
        className={`flex flex-row flex-nowrap whitespace-nowrap font-bold text-5xl md:text-7xl uppercase select-none will-change-transform transition-colors duration-500 group-hover:text-black dark:group-hover:text-white ${className}`}
      >
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="block mr-8">{children}</span>
        ))}
      </div>
    </div>
  );
}

export default function ScrollVelocity({
  texts = [],
  velocity = 100,
  className = '',
  mode = 'scroll',
}: {
  texts?: string[];
  velocity?: number;
  className?: string;
  mode?: 'scroll' | 'pingpong';
}) {
  return (
    <section className="relative w-full overflow-hidden py-6">
      {mode === 'pingpong'
        ? texts.map((text, index) => (
            <PingPongText key={index} reverse={index % 2 === 1} duration={14 + index * 4} className={className}>
              {text}
            </PingPongText>
          ))
        : texts.map((text, index) => (
            <ParallaxText key={index} baseVelocity={index % 2 === 0 ? velocity : -velocity} className={className}>
              {text}
            </ParallaxText>
          ))}
    </section>
  );
}

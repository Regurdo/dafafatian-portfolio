'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Module-level singleton — safer than window globals (lenis ships its own
// conflicting Window.lenis type augmentation)
let lenisInstance: Lenis | null = null;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Don't hijack scroll for users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Expose module-level so nav links etc. can use lenis.scrollTo()
    lenisInstance = lenis;

    // Keep GSAP ScrollTrigger perfectly in sync with Lenis scrolling
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP's ticker for a unified RAF loop
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}

/** Smooth-scroll helper that falls back to native behavior if Lenis is absent */
export function scrollToSection(selector: string) {
  const target = document.querySelector(selector);
  if (!target) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: 0, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

/** Scroll back to top via Lenis (or native fallback) */
export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.4 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

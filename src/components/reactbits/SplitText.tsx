'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: Record<string, string | number>;
  animationTo?: Record<string, string | number>;
  easing?: string;
  threshold?: number;
  rootMargin?: string;
  tag?: React.ElementType;
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text = '',
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'power3.out',
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);

  const flattenedChars: { char: string; isSpace: boolean }[] = [];
  text.split(' ').forEach((word, wIdx, arr) => {
    word.split('').forEach((char) => {
      flattenedChars.push({ char, isSpace: false });
    });
    if (wIdx < arr.length - 1) {
      flattenedChars.push({ char: '\u00A0', isSpace: true });
    }
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const charElements = el.querySelectorAll('.split-char');
    if (!charElements.length) return;

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observerInstance.unobserve(entry.target);
            gsap.fromTo(
              charElements,
              { ...animationFrom },
              {
                ...animationTo,
                duration: 0.8,
                stagger: delay / 1000,
                ease: easing,
                onComplete: () => {
                  if (onLetterAnimationComplete) onLetterAnimationComplete();
                },
              }
            );
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, animationFrom, animationTo, easing, threshold, rootMargin, onLetterAnimationComplete]);

  const Tag = tag as React.ElementType;

  return (
    <Tag ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {flattenedChars.map((item, index) => {
          if (item.isSpace) {
            return <span key={index} className="inline-block">&nbsp;</span>;
          }
          return (
            <span
              key={index}
              className="split-char inline-block will-change-[transform,opacity]"
              style={{ opacity: 0 }}
            >
              {item.char}
            </span>
          );
        })}
      </span>
    </Tag>
  );
};

export default SplitText;

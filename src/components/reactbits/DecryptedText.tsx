'use client';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover';
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const iterationCount = useRef(0);
  const revealedIndices = useRef(new Set<number>());
  const containerRef = useRef<HTMLSpanElement>(null);

  const availableChars = useMemo(() => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split(''))).filter((char) => char !== ' ');
    }
    return characters.split('');
  }, [text, useOriginalCharsOnly, characters]);

  const shuffleText = useCallback(
    (currentText: string, revealed: Set<number>) => {
      return text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (revealed.has(i)) return text[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [text, availableChars]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let isMounted = true;

    if (isScrambling) {
      if (sequential) {
        let index = 0;
        const revealOrder: number[] = [];
        if (revealDirection === 'start') {
          for (let i = 0; i < text.length; i++) revealOrder.push(i);
        } else if (revealDirection === 'end') {
          for (let i = text.length - 1; i >= 0; i--) revealOrder.push(i);
        } else {
          const mid = Math.floor(text.length / 2);
          revealOrder.push(mid);
          for (let step = 1; step <= mid; step++) {
            if (mid - step >= 0) revealOrder.push(mid - step);
            if (mid + step < text.length) revealOrder.push(mid + step);
          }
        }
        interval = setInterval(() => {
          if (!isMounted) return;
          if (index < revealOrder.length) {
            revealedIndices.current.add(revealOrder[index]);
            setDisplayText(shuffleText(text, revealedIndices.current));
            index++;
          } else {
            clearInterval(interval);
            setIsScrambling(false);
          }
        }, speed);
      } else {
        interval = setInterval(() => {
          if (!isMounted) return;
          if (iterationCount.current < maxIterations) {
            setDisplayText(shuffleText(text, revealedIndices.current));
            iterationCount.current++;
          } else {
            clearInterval(interval);
            setDisplayText(text);
            setIsScrambling(false);
          }
        }, speed);
      }
    }

    return () => { isMounted = false; clearInterval(interval); };
  }, [isScrambling, text, speed, maxIterations, sequential, revealDirection, shuffleText]);

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsScrambling(true);
            setHasAnimated(true);
          }
        },
        { threshold: 0.1 }
      );
      if (containerRef.current) observer.observe(containerRef.current);
      return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
    }
  }, [animateOn, hasAnimated]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      revealedIndices.current.clear();
      iterationCount.current = 0;
      setIsScrambling(true);
    }
  };

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealed = revealedIndices.current.has(index) || !isScrambling || displayText === text;
          return (
            <span key={index} className={isRevealed ? className : `${className} ${encryptedClassName}`}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}

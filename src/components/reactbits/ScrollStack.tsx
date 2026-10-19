'use client';

import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import './ScrollStack.css';

const resolveOffset = (value: number | string, size: number): number => {
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (text.endsWith('%')) return (parseFloat(text) / 100) * size;
  return parseFloat(text) || 0;
};

const toLength = (value: number | string): string => (typeof value === 'number' ? `${value}px` : value);

export interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
  style?: CSSProperties;
}

export const ScrollStackItem = ({ children, itemClassName = '', style }: ScrollStackItemProps) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style}>
    {children}
    <span className="scroll-stack-card__shade" aria-hidden="true" />
  </div>
);

interface ScrollStackSettings {
  itemDistance: number;
  itemStackDistance: number;
  stackPosition: number | string;
  itemScale: number;
  baseScale: number;
  dimAmount: number;
  blurAmount: number;
  tiltAmount: number;
  rotationAmount: number;
  holdDistance: number;
  smoothScroll: boolean;
  snap: boolean;
  onStackComplete?: () => void;
}

export interface ScrollStackProps extends Partial<ScrollStackSettings> {
  children: ReactNode;
  className?: string;
  useWindowScroll?: boolean;
}

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemStackDistance = 24,
  stackPosition = '15%',
  itemScale = 0.05,
  baseScale = 0.8,
  dimAmount = 0.2,
  blurAmount = 0,
  tiltAmount = 0,
  rotationAmount = 0,
  holdDistance = 200,
  smoothScroll = false,
  snap = false,
  useWindowScroll = false,
  onStackComplete,
}: ScrollStackProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<ScrollStackSettings | null>(null);
  const items = Children.toArray(children);

  settingsRef.current = {
    itemDistance,
    itemStackDistance,
    stackPosition,
    itemScale,
    baseScale,
    dimAmount,
    blurAmount,
    tiltAmount,
    rotationAmount,
    holdDistance,
    smoothScroll,
    snap,
    onStackComplete,
  };

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const end = endRef.current;
    if (!root || !inner || !end) return undefined;

    const windowed = useWindowScroll;
    const target: Window | HTMLDivElement = windowed ? window : root;

    let slots: HTMLElement[] = [];
    let anchors: HTMLElement[] = [];
    let cards: HTMLElement[] = [];
    let shades: HTMLElement[] = [];
    let heights: number[] = [];
    let anchorDocTops: number[] = [];
    let cardTransforms: string[] = [];
    let cardDims: string[] = [];

    let complete = false;
    let ticking = false;
    let destroyed = false;

    // Measure geometry ONCE on mount, resize, or image load.
    // Never call getBoundingClientRect/offsetHeight during scroll!
    const measure = () => {
      if (destroyed) return;
      slots = Array.from(inner.querySelectorAll<HTMLElement>('[data-stack-slot]'));
      anchors = Array.from(inner.querySelectorAll<HTMLElement>('[data-stack-anchor]'));
      cards = slots.map((s) => s.firstElementChild as HTMLElement).filter(Boolean);
      shades = cards.map((c) => c.querySelector<HTMLElement>('.scroll-stack-card__shade') as HTMLElement);

      const scrollNow = windowed ? window.scrollY : root.scrollTop;
      const count = slots.length;

      heights = slots.map((slot) => slot.offsetHeight);
      anchorDocTops = anchors.map((anchor) => {
        const rect = anchor.getBoundingClientRect();
        return rect.top + scrollNow;
      });

      cardTransforms = new Array(count).fill('');
      cardDims = new Array(count).fill('');

      // Set hold distance height on the end marker
      const settings = settingsRef.current;
      if (settings && end) {
        end.style.height = `${settings.holdDistance}px`;
      }

      // Immediately run one update to set initial scales
      update();
    };

    const update = () => {
      const settings = settingsRef.current;
      if (!settings || !slots.length || !anchorDocTops.length) return;

      const scrollNow = windowed ? window.scrollY : root.scrollTop;
      const viewHeight = windowed ? window.innerHeight : root.clientHeight;
      const stackTop = resolveOffset(settings.stackPosition, viewHeight);
      const offset = settings.itemStackDistance;
      const count = slots.length;

      // Pure math calculations — zero DOM reads in this hot path!
      const depths = new Float32Array(count);
      let lastCover = 0;

      for (let j = 1; j < count; j++) {
        const pinBefore = stackTop + (j - 1) * offset;
        const start = pinBefore + (heights[j - 1] || 500);
        const span = Math.max(1, start - (pinBefore + offset));
        const slotTop = Math.max(anchorDocTops[j] - scrollNow, stackTop + j * offset);
        const cover = Math.min(1, Math.max(0, (start - slotTop) / span));
        for (let i = 0; i < j; i++) {
          depths[i] += cover;
        }
        lastCover = cover;
      }

      const dimStep = Math.min(Math.max(settings.dimAmount, 0), 1);
      const use3D = settings.tiltAmount > 0 || settings.rotationAmount > 0;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!card) continue;
        const depth = depths[i];
        const scale = Math.max(settings.baseScale, 1 - depth * settings.itemScale);
        const dim = 1 - Math.pow(1 - dimStep, depth);

        let transformStr = '';
        if (depth > 0.0005) {
          if (use3D) {
            const lean = Math.min(depth, 1);
            const tilt = -lean * settings.tiltAmount;
            const turn = lean * settings.rotationAmount * (i % 2 ? -1 : 1);
            transformStr = `perspective(1200px) rotateX(${tilt.toFixed(2)}deg) rotate(${turn.toFixed(2)}deg) scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)`;
          } else {
            transformStr = `translate3d(0, 0, 0) scale(${scale.toFixed(4)})`;
          }
        } else {
          transformStr = 'translate3d(0, 0, 0)';
        }

        if (cardTransforms[i] !== transformStr) {
          cardTransforms[i] = transformStr;
          card.style.transform = transformStr;
        }

        const shade = shades[i];
        if (shade) {
          const dimStr = dim > 0.005 ? dim.toFixed(3) : '0';
          if (cardDims[i] !== dimStr) {
            cardDims[i] = dimStr;
            shade.style.opacity = dimStr;
          }
        }
      }

      const done = count > 1 && lastCover >= 0.999;
      if (done !== complete) {
        complete = done;
        if (done) settings.onStackComplete?.();
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };

    // Initial measurement after browser layout finishes
    const timer = setTimeout(measure, 60);

    // Re-measure when window is resized or images finish loading
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('load', measure, { passive: true });

    // Listen to scroll events on window/target
    target.addEventListener('scroll', onScroll, { passive: true });
    if (windowed) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      destroyed = true;
      clearTimeout(timer);
      target.removeEventListener('scroll', onScroll);
      if (windowed) {
        window.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
    };
  }, [useWindowScroll]);

  return (
    <div
      ref={rootRef}
      className={`scroll-stack ${useWindowScroll ? 'scroll-stack--window' : 'scroll-stack--contained'} ${className}`.trim()}
    >
      <div ref={innerRef} className="scroll-stack__inner">
        {items.map((child, index) => {
          const gap = itemDistance - (items.length - index) * itemStackDistance;
          return (
            <Fragment key={isValidElement(child) ? (child.key ?? index) : index}>
              {index > 0 && (
                <div aria-hidden="true" style={{ height: Math.max(0, gap), marginTop: Math.min(0, gap) }} />
              )}
              {/* Static anchor for measuring true in-flow document position without sticky offset */}
              <div
                data-stack-anchor=""
                style={{ position: 'relative', width: '100%', height: 0, pointerEvents: 'none' }}
                aria-hidden="true"
              />
              <div
                data-stack-slot=""
                className="scroll-stack__slot"
                style={{
                  top: `calc(${toLength(stackPosition)} + ${index * itemStackDistance}px)`,
                  marginBottom: (items.length - 1 - index) * itemStackDistance,
                  zIndex: index + 1,
                }}
              >
                {child}
              </div>
            </Fragment>
          );
        })}
        <div ref={endRef} className="scroll-stack__end" aria-hidden="true" />
      </div>
    </div>
  );
};

export default ScrollStack;

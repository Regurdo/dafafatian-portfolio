'use client';

import React from 'react';
import { Code2, Server, Terminal, Palette, Layers, Cpu } from 'lucide-react';

// Brand & Tech Icons
export function GithubIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function TwitterIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ReactIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-11.5 -10.232 23 20.463" fill="none" className={className}>
      <circle cx="0" cy="0" r="2.05" fill="#00D8FF" />
      <g stroke="#00D8FF" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function NextjsIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12 6.63 0 12-5.37 12-12C24 5.37 18.63 0 12 0zm5.88 18.67l-6.85-8.91v8.91H9.5V5.33h1.74l6.84 8.89V5.33h1.53v13.34h-1.73z" />
    </svg>
  );
}

export function TypescriptIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path
        d="M14.7 13.5c-.3-.2-.7-.3-1.1-.3-.6 0-1 .2-1 .6 0 .4.3.5.9.8.8.3 1.6.8 1.6 1.8 0 1.2-.9 1.9-2.2 1.9-.8 0-1.5-.2-2-.6l.4-1.2c.4.3.9.5 1.5.5.6 0 1-.2 1-.6 0-.4-.4-.5-1-.7-.8-.3-1.6-.7-1.6-1.7 0-1.1.9-1.8 2.1-1.8.7 0 1.3.2 1.7.4l-.4 1.2zM7.2 8.3h4.6v1.3H9.8V18H8.3V9.6H7.2V8.3z"
        fill="white"
      />
    </svg>
  );
}

export function TailwindIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#38BDF8" className={className}>
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
    </svg>
  );
}

export function FramerMotionIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill="#0055FF" />
    </svg>
  );
}

export function GsapIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#0AE448" />
      <path
        d="M6 14.5c0 1.9 1.6 3.5 3.5 3.5 1.7 0 3-1.1 3.4-2.6h-2.1c-.3.5-.8.9-1.3.9-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8c.7 0 1.2.4 1.5.9h2.1C12.6 11.2 11.2 10 9.5 10 7.6 10 6 11.6 6 13.5v1zm8.5-5.5h-2.3L15.4 5h2.1l-3 4zm-.5 3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5z"
        fill="#000"
      />
    </svg>
  );
}

export function NodejsIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#68A063" className={className}>
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 2.3L5.34 8.1v7.8L12 19.7l6.66-3.8V8.1L12 4.3z" />
      <path d="M12 7a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function PostgreSqlIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#336791" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.5c-1.8 0-3.3-1-4-2.5h2.2c.4.6 1.1 1 1.8 1 1.1 0 2-.9 2-2v-1.2c-.6.7-1.4 1.2-2.3 1.2-2.2 0-4-1.8-4-4s1.8-4 4-4c1 0 1.8.4 2.4 1.1V8h2.1v7.8c0 2.2-1.8 4-4.2 4zm.1-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

export function SupabaseIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13.35 2.15a1.2 1.2 0 0 0-1.95.4L5.2 15.35a1.2 1.2 0 0 0 1.05 1.65h6.15l-1.9 5.8a1.2 1.2 0 0 0 1.95.4l6.2-12.8a1.2 1.2 0 0 0-1.05-1.65H11.4l1.95-6.6z"
        fill="#3ECF8E"
      />
    </svg>
  );
}

export function PythonIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        d="M11.9 2c-3.1 0-5 1.3-5 3.3v2.2h5.1v.8H4.6c-2 0-3.6 1.4-3.6 3.7 0 2.2 1.4 3.7 3.5 3.7h1.4v-2c0-1.5 1.3-2.7 2.8-2.7h5.1c1.2 0 2.2-1 2.2-2.2V5.3c0-2-1.9-3.3-4.1-3.3zm-1.8 1.8c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
        fill="#3776AB"
      />
      <path
        d="M12.1 22c3.1 0 5-1.3 5-3.3v-2.2H12v-.8h7.4c2 0 3.6-1.4 3.6-3.7 0-2.2-1.4-3.7-3.5-3.7h-1.4v2c0 1.5-1.3 2.7-2.8 2.7H10.2c-1.2 0-2.2 1-2.2 2.2v3.4c0 2 1.9 3.3 4.1 3.3zm1.8-1.8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
        fill="#FFD43B"
      />
    </svg>
  );
}

export function DockerIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#2496ED" className={className}>
      <path d="M13.98 11.08h1.64v1.64h-1.64zm-2.46 0h1.64v1.64h-1.64zm-2.46 0h1.64v1.64H9.06zm-2.46 0h1.64v1.64H6.6zm7.38-2.46h1.64v1.64h-1.64zm-2.46 0h1.64v1.64h-1.64zm-2.46 0h1.64v1.64H9.06zm4.92-2.46h1.64v1.64h-1.64zm8.61 7.28c-.45-.33-1.39-.41-2.13-.16-.16-.66-.57-1.15-.57-1.15s-.74.49-.9 1.15c-.49-.16-1.31-.08-1.72.16-.33.16-.66.49-.66.9 0 2.79-2.21 4.92-5.41 4.92-4.18 0-6.8-2.21-7.87-4.51-.25.08-.49.16-.82.16-1.07 0-1.8-.74-2.13-1.39-.08.33-.08.66-.08.98 0 4.18 3.52 7.54 8.52 7.54 4.59 0 8.28-2.79 8.77-6.8.66.08 1.8-.25 2.38-.82.16-.25.25-.49.33-.74-.25-.08-.49-.16-.74-.28z" />
    </svg>
  );
}

export function GitIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F05032" className={className}>
      <path d="M23.54 11.15l-10.7-10.7a1.6 1.6 0 0 0-2.27 0L8.3 2.72l3.41 3.41c.4-.13.86-.06 1.2.22.46.38.6 1 .37 1.54l3.29 3.29c.54-.23 1.16-.09 1.54.37.52.62.46 1.54-.15 2.08-.62.53-1.54.47-2.07-.15-.38-.45-.45-1.08-.2-1.61l-3.08-3.08v6.78c.2.14.37.33.48.56.36.74.05 1.64-.69 2-.74.36-1.64.05-2-.69-.36-.74-.05-1.64.69-2 .24-.12.5-.16.76-.14V8.42a1.6 1.6 0 0 1-.76-.14c-.74-.36-1.05-1.26-.69-2 .26-.53.79-.86 1.36-.86.13 0 .26.02.39.06L7.17 1.58.46 8.3a1.6 1.6 0 0 0 0 2.27l10.7 10.7c.63.63 1.64.63 2.27 0l10.11-10.12a1.6 1.6 0 0 0 0-2.27z" />
    </svg>
  );
}

export function FigmaIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83" />
      <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF" />
      <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="#F24E1E" />
      <path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="#FF7262" />
      <path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="#1ABCFE" />
    </svg>
  );
}

/**
 * Returns the matching brand SVG icon based on the skill name.
 */
export function getSkillIcon(name: string, size = 20): React.ReactElement {
  const lower = name.toLowerCase();

  if (lower.includes('react')) return <ReactIcon size={size} />;
  if (lower.includes('next')) return <NextjsIcon size={size} />;
  if (lower.includes('typescript') || lower === 'ts') return <TypescriptIcon size={size} />;
  if (lower.includes('tailwind')) return <TailwindIcon size={size} />;
  if (lower.includes('framer')) return <FramerMotionIcon size={size} />;
  if (lower.includes('gsap') || lower.includes('greensock')) return <GsapIcon size={size} />;
  if (lower.includes('node')) return <NodejsIcon size={size} />;
  if (lower.includes('postgres') || lower.includes('sql')) return <PostgreSqlIcon size={size} />;
  if (lower.includes('supabase')) return <SupabaseIcon size={size} />;
  if (lower.includes('python')) return <PythonIcon size={size} />;
  if (lower.includes('docker')) return <DockerIcon size={size} />;
  if (lower.includes('git')) return <GitIcon size={size} />;
  if (lower.includes('figma')) return <FigmaIcon size={size} />;

  // Default fallback
  return <Code2 size={size} className="text-neutral-500" />;
}

/**
 * Returns a category badge icon for section headers.
 */
export function getCategoryIcon(category: string, size = 14): React.ReactElement {
  const lower = category.toLowerCase();
  if (lower.includes('front')) return <Code2 size={size} />;
  if (lower.includes('back')) return <Server size={size} />;
  if (lower.includes('devops') || lower.includes('cloud')) return <Terminal size={size} />;
  if (lower.includes('design') || lower.includes('creative')) return <Palette size={size} />;
  return <Layers size={size} />;
}

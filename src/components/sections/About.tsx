'use client';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import HalftoneReveal from '@/components/reactbits/HalftoneReveal';
import { Profile } from '@/lib/supabase';
import { MapPin, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/icons/BrandIcons';

interface AboutProps {
  profile: Profile;
}

export default function About({ profile }: AboutProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedContent distance={60} duration={1}>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4 block">{t.about.tag}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-12 tracking-tight">{t.about.title}</h2>
        </AnimatedContent>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Halftone portrait */}
          <AnimatedContent distance={80} duration={1} delay={0.2}>
            <div className="relative w-full max-w-md mx-auto">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200 dark:bg-[#0a0a0a]">
                {/* Fallback photo (also serves no-WebGL / no-JS) */}
                <img
                  src="/dafa-portrait.png"
                  alt={`Portrait of ${profile.name}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Halftone print effect — hover to reveal the real photo */}
                <HalftoneReveal
                  src="/dafa-portrait.png"
                  fit="cover"
                  mode="mono"
                  shape="dot"
                  cellSize={7}
                  angle={45}
                  inkColor={isDark ? '#e8e8e8' : '#171717'}
                  paperColor={isDark ? '#0a0a0a' : '#f8f9fa'}
                  revealRadius={150}
                  softness={0.6}
                  linger={1.2}
                  className="absolute inset-0"
                />
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={80} duration={1} delay={0.4}>
            <div className="space-y-6">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {t.hero.bio}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t.about.philosophy}
              </p>
              {profile.location && (
                <div className="flex items-center gap-2 text-neutral-500">
                  <MapPin size={16} />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}

              <div className="pt-6 border-t border-black/[0.08] dark:border-white/[0.06]">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{t.about.connect}</h3>
                <div className="space-y-3">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group">
                      <Mail size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm">{profile.email}</span>
                    </a>
                  )}
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group">
                      <GithubIcon size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group">
                      <LinkedinIcon size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group">
                      <TwitterIcon size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}

'use client';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { Experience as ExperienceType } from '@/lib/supabase';
import { Briefcase, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface ExperienceProps {
  experiences: ExperienceType[];
}

function formatDate(date: string, lang: string) {
  return new Date(date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function Experience({ experiences }: ExperienceProps) {
  const { t, language } = useLanguage();

  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedContent distance={60} duration={1}>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4 block">
            {t.experience.tag}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-16 tracking-tight">
            {t.experience.title}
          </h2>
        </AnimatedContent>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-black/20 dark:from-white/20 via-black/10 dark:via-white/10 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const expData = t.experience.items[exp.id];
              const title = expData?.title || exp.title;
              const description = expData?.description || exp.description;

              return (
                <AnimatedContent key={exp.id} distance={60} duration={0.8} delay={index * 0.15}>
                  <div className="relative flex gap-6 md:gap-10">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 md:w-16 flex justify-center">
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                          exp.is_current
                            ? 'border-neutral-900/30 dark:border-white/30 bg-neutral-900/10 dark:bg-white/10'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#141414] shadow-sm'
                        }`}
                      >
                        {exp.type === 'work' ? (
                          <Briefcase size={16} className="text-neutral-600 dark:text-neutral-400" />
                        ) : (
                          <GraduationCap size={16} className="text-neutral-600 dark:text-neutral-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {title}
                        </h3>
                        {exp.is_current && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-black/[0.06] dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 rounded-full font-medium">
                            {t.experience.current}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ''}
                      </p>
                      <p className="text-xs text-neutral-500 mb-3 font-mono">
                        {formatDate(exp.start_date, language)} —{' '}
                        {exp.is_current ? t.experience.present : exp.end_date ? formatDate(exp.end_date, language) : ''}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

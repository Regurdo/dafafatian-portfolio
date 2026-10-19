'use client';

import { useRef, useEffect, useState } from 'react';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { Skill } from '@/lib/supabase';
import { getSkillIcon, getCategoryIcon } from '@/components/icons/BrandIcons';
import { useLanguage } from '@/components/LanguageProvider';

interface SkillsProps {
  skills: Skill[];
}

function SkillCard({
  skill,
  inView,
  levels,
}: {
  skill: Skill;
  inView: boolean;
  levels: {
    expert: string;
    advanced: string;
    proficient: string;
    experienced: string;
  };
}) {
  const icon = getSkillIcon(skill.name, 20);
  const levelText =
    skill.proficiency >= 90
      ? levels.expert
      : skill.proficiency >= 85
      ? levels.advanced
      : skill.proficiency >= 80
      ? levels.proficient
      : levels.experienced;

  return (
    <div className="group relative p-3.5 sm:p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] p-2 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-black/25 dark:group-hover:border-white/25">
            {icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
              {skill.name}
            </h4>
            <span className="text-[11px] text-neutral-500 font-medium block">
              {levelText}
            </span>
          </div>
        </div>
        <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] shrink-0 border border-black/[0.05] dark:border-white/[0.05]">
          {skill.proficiency}%
        </span>
      </div>

      {/* Progress track */}
      <div className="h-1.5 w-full bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neutral-700 to-black dark:from-neutral-300 dark:to-white rounded-full transition-all duration-1000 ease-out"
          style={{ width: inView ? `${skill.proficiency}%` : '0%' }}
        />
      </div>
    </div>
  );
}

export default function Skills({ skills }: SkillsProps) {
  const { t, language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section id="skills" className="py-32 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <AnimatedContent distance={60} duration={1}>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4 block">
            {t.skills.tag}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-12 tracking-tight">
            {t.skills.title}
          </h2>
        </AnimatedContent>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
          {categories.map((category, catIndex) => {
            const categorySkills = skills.filter((s) => s.category === category);
            const categoryName = t.skills.categories[category] || category;
            const countLabel =
              language === 'id'
                ? `${categorySkills.length} teknologi`
                : `${categorySkills.length} ${categorySkills.length === 1 ? 'tool' : 'tools'}`;

            return (
              <AnimatedContent key={category} distance={50} duration={0.8} delay={catIndex * 0.12}>
                <div>
                  <div className="flex items-center justify-between pb-3 mb-5 border-b border-black/[0.08] dark:border-white/[0.08]">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      {getCategoryIcon(category, 15)}
                      <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-700 dark:text-neutral-300">
                        {categoryName}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {countLabel}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {categorySkills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        inView={inView}
                        levels={t.skills.levels}
                      />
                    ))}
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}

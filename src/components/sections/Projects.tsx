'use client';
import { useState } from 'react';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import ScrollStack, { ScrollStackItem } from '@/components/reactbits/ScrollStack';
import ProjectLightbox from '@/components/ProjectLightbox';
import { Project } from '@/lib/supabase';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';
import { useLanguage } from '@/components/LanguageProvider';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedContent distance={60} duration={1}>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4 block">{t.projects.tag}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">{t.projects.title}</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-12 max-w-xl">{t.projects.subtitle}</p>
        </AnimatedContent>
      </div>

      {/* Scroll stack — pins with window scroll. Keep ancestors overflow-visible. */}
      <div className="max-w-7xl mx-auto">
        <ScrollStack
          useWindowScroll
          itemDistance={140}
          itemStackDistance={28}
          stackPosition="10%"
          itemScale={0.045}
          baseScale={0.85}
          dimAmount={0.28}
          blurAmount={0}
          tiltAmount={0}
          rotationAmount={0}
          holdDistance={320}
          smoothScroll={false}
          snap={false}
          className="!px-0"
        >
          {projects.map((project) => (
            <ScrollStackItem key={project.id} itemClassName="project-stack-card">
              {/* Split card: info left, image right (stacks on mobile) */}
              <div className="grid md:grid-cols-[42%_58%] min-h-[26rem] md:min-h-[72vh]">
                {/* Left: text info */}
                <div className="flex flex-col p-8 md:p-14 gap-6 bg-white/90 dark:bg-neutral-950/60">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="group/link flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {t.projects.viewProject}
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </button>
                    <span className="text-[11px] uppercase tracking-wider text-neutral-500">
                      {project.category}
                    </span>
                  </div>

                  <h3
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedProject(project)}
                  >
                    {t.projects.items[project.id]?.title || project.title}
                  </h3>

                  <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-4">
                    {t.projects.items[project.id]?.description || project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-black/[0.04] dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 rounded-full border border-black/[0.08] dark:border-white/[0.08]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 5 && (
                      <span className="px-2.5 py-1 text-[10px] text-neutral-500">
                        +{project.tech_stack.length - 5}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center gap-4 pt-4">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} /> {t.projects.live}
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <GithubIcon size={14} /> {t.projects.code}
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="ml-auto text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {t.projects.details}
                    </button>
                  </div>
                </div>

                {/* Right: image */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  aria-label={`View details of ${project.title}`}
                  className="relative min-h-[18rem] cursor-pointer overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900"
                >
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-neutral-700 text-lg font-mono uppercase tracking-[0.3em]">
                        {project.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      {/* Project detail lightbox */}
      <ProjectLightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
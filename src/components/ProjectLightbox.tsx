'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Calendar, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';
import { Project } from '@/lib/supabase';

import { useLanguage } from '@/components/LanguageProvider';

interface ProjectLightboxProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectLightbox({ project, onClose }: ProjectLightboxProps) {
  const { t } = useLanguage();

  // Close on Escape
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!project) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [project]);

  const year = project ? new Date(project.created_at).getFullYear() : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — project details`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#141414] shadow-2xl shadow-black/20 dark:shadow-black/60 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image header */}
            <div className="relative h-56 md:h-72 overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-neutral-500 dark:text-neutral-600 text-sm font-mono uppercase tracking-[0.3em]">{project.category}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#141414] via-transparent to-black/20" />

              {/* Close button */}
              <button
                onClick={onClose}
                autoFocus
                aria-label={t.projects.closeDetails}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white hover:bg-black/80 hover:rotate-90 transition-all duration-300 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 -mt-6 relative">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 text-[10px] uppercase tracking-wider bg-black/[0.05] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 rounded-full border border-black/[0.08] dark:border-white/[0.08]">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="flex items-center gap-1 px-3 py-1 text-[10px] uppercase tracking-wider bg-neutral-900 text-white dark:bg-white dark:text-black rounded-full font-medium">
                    <Sparkles size={10} /> {t.projects.featured}
                  </span>
                )}
                {year && (
                  <span className="flex items-center gap-1.5 text-xs text-neutral-500 ml-1">
                    <Calendar size={12} /> {year}
                  </span>
                )}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                {t.projects.items[project.id]?.title || project.title}
              </h3>

              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                {t.projects.items[project.id]?.description || project.long_description || project.description}
              </p>

              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 block mb-3">
                  {t.projects.techStack}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] uppercase tracking-wider bg-black/[0.04] dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 rounded-full border border-black/[0.06] dark:border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {(project.live_url || project.github_url) && (
                <div className="flex flex-wrap gap-3 pt-6 border-t border-black/[0.08] dark:border-white/[0.06]">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-medium rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors duration-300 uppercase tracking-wider"
                    >
                      <ExternalLink size={14} /> {t.projects.visitLiveSite}
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 border border-neutral-300 dark:border-white/[0.15] text-neutral-900 dark:text-white text-xs font-medium rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors duration-300 uppercase tracking-wider"
                    >
                      <GithubIcon size={14} /> {t.projects.viewSource}
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

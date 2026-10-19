'use client';
import { useState, useEffect } from 'react';
import { Profile } from '@/lib/supabase';
import { Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/icons/BrandIcons';
import { useLanguage } from '@/components/LanguageProvider';

interface FooterProps {
  profile: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const { t } = useLanguage();
  const [year, setYear] = useState<number | string>(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-black/[0.08] dark:border-white/[0.05] py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-neutral-500">
          © {year} {profile.name}. {t.footer.builtWith}{' '}
          <Heart size={12} className="inline text-neutral-400" />{' '}
          {t.footer.using}
        </div>
        <div className="flex items-center gap-4">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <GithubIcon size={18} />
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <LinkedinIcon size={18} />
            </a>
          )}
          {profile.twitter && (
            <a
              href={profile.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <TwitterIcon size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

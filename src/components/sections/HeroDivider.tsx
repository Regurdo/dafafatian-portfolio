'use client';

import { useLanguage } from '@/components/LanguageProvider';
import ScrollVelocity from '@/components/reactbits/ScrollVelocity';

export default function HeroDivider() {
  const { t } = useLanguage();

  return (
    <ScrollVelocity
      texts={t.hero.ticker}
      velocity={30}
      mode="pingpong"
      className="text-black/[0.08] dark:text-white/[0.06] tracking-tighter transition-colors duration-500 group-hover:text-black dark:group-hover:text-white"
    />
  );
}

'use client';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import Magnet from '@/components/reactbits/Magnet';
import ClickSpark from '@/components/reactbits/ClickSpark';
import { sendMessage } from '@/lib/queries';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const success = await sendMessage(form);
    setStatus(success ? 'success' : 'error');
    if (success) setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedContent distance={60} duration={1}>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4 block">
            {t.contact.tag}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-12">
            {t.contact.subtitle}
          </p>
        </AnimatedContent>

        <AnimatedContent distance={80} duration={1} delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  {t.contact.nameLabel}
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/[0.02] dark:bg-transparent border border-black/[0.1] dark:border-white/[0.08] rounded-xl px-4 py-3 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-white/[0.2] transition-colors"
                  placeholder={t.contact.namePlaceholder}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  {t.contact.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-black/[0.02] dark:bg-transparent border border-black/[0.1] dark:border-white/[0.08] rounded-xl px-4 py-3 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-white/[0.2] transition-colors"
                  placeholder={t.contact.emailPlaceholder}
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                {t.contact.subjectLabel}
              </label>
              <input
                id="subject"
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-black/[0.02] dark:bg-transparent border border-black/[0.1] dark:border-white/[0.08] rounded-xl px-4 py-3 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-white/[0.2] transition-colors"
                placeholder={t.contact.subjectPlaceholder}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                {t.contact.messageLabel}
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-black/[0.02] dark:bg-transparent border border-black/[0.1] dark:border-white/[0.08] rounded-xl px-4 py-3 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-white/[0.2] transition-colors resize-none"
                placeholder={t.contact.messagePlaceholder}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <ClickSpark sparkColor={isDark ? '#ffffff' : '#171717'} sparkCount={12} sparkRadius={30}>
                <Magnet padding={50} magnetStrength={3}>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-3 bg-neutral-900 text-white dark:bg-white dark:text-black font-medium rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 text-sm uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {status === 'loading' ? t.contact.sending : t.contact.sendButton}
                    <Send size={14} />
                  </button>
                </Magnet>
              </ClickSpark>

              {status === 'success' && (
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  <CheckCircle size={16} /> {t.contact.successMessage}
                </span>
              )}
              {status === 'error' && (
                <span className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
                  <AlertCircle size={16} /> {t.contact.errorMessage}
                </span>
              )}
            </div>
          </form>
        </AnimatedContent>
      </div>
    </section>
  );
}

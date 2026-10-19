'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';

/* ------------------------------------------------------------------
 * Design tokens — disalin dari form kontak & section di portfolio
 * ------------------------------------------------------------------ */
export const labelClass = 'block text-xs uppercase tracking-wider text-neutral-500 mb-2';

export const inputClass =
  'w-full bg-black/[0.02] dark:bg-transparent border border-black/[0.1] dark:border-white/[0.08] rounded-xl px-4 py-3 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-white/[0.2] transition-colors disabled:opacity-50';

export const chipClass =
  'px-2.5 py-1 text-[10px] uppercase tracking-wider bg-black/[0.04] dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 rounded-full border border-black/[0.08] dark:border-white/[0.08]';

export const cardClass =
  'rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03]';

/* ------------------------------------------------------------------ */

export function Spinner({ size = 16 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin" />;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${cardClass} ${className}`}>{children}</div>;
}

export function SectionHeader({
  tag,
  title,
  subtitle,
  action,
}: {
  tag: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4 block">{tag}</span>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  loading?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const sizing = size === 'sm' ? 'px-4 py-2 text-[11px]' : 'px-8 py-3 text-sm';
  const styles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200',
    ghost:
      'border border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white',
    danger:
      'border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10',
  };
  const variantClass = styles[variant];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizing} ${variantClass} ${className}`}
      {...rest}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-neutral-500">{hint}</p>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} resize-none ${props.className ?? ''}`} />;
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 cursor-pointer"
    >
      <span
        className={`relative h-6 w-11 rounded-full border transition-colors duration-300 ${
          checked
            ? 'bg-neutral-900 dark:bg-white border-transparent'
            : 'bg-black/[0.06] dark:bg-white/[0.08] border-black/[0.08] dark:border-white/[0.08]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 ${
            checked
              ? 'left-[22px] bg-white dark:bg-black'
              : 'left-0.5 bg-neutral-500 dark:bg-neutral-400'
          }`}
        />
      </span>
      <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
    </button>
  );
}

/** Pilihan segmented berbentuk pill (mirip LanguageToggle di navbar) */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full p-0.5 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
            value === o.value
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Input tag (tech stack): Enter / koma untuk menambah, Backspace untuk menghapus terakhir */
export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const parts = draft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (parts.length) onChange([...value, ...parts]);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-black/[0.1] dark:border-white/[0.08] bg-black/[0.02] dark:bg-transparent px-3 py-2.5 focus-within:border-neutral-400 dark:focus-within:border-white/[0.2] transition-colors">
      {value.map((tag) => (
        <span key={tag} className={`${chipClass} inline-flex items-center gap-1.5`}>
          {tag}
          <button
            type="button"
            aria-label={`Hapus ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={value.length ? '' : placeholder}
        className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none"
      />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-black/[0.12] dark:border-white/[0.1] px-6 py-16 text-center">
      <p className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/[0.06] px-5 py-4 text-sm text-red-700 dark:text-red-300">
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1 min-w-[12rem]">{message}</span>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}

export function LoadingBlock({ label = 'Memuat data…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-sm text-neutral-500">
      <Spinner /> {label}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Modal
 * ------------------------------------------------------------------ */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0f0f0f] shadow-2xl shadow-black/20 dark:shadow-black/60 ${
              wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'
            }`}
          >
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-4">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                {title}
              </h2>
              <IconButton label="Tutup" onClick={onClose}>
                <X size={16} />
              </IconButton>
            </div>
            {/* data-lenis-prevent: biar scroll di dalam modal tidak dibajak Lenis */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-6">
              {children}
            </div>
            {footer && (
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-black/[0.06] dark:border-white/[0.06] px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Hapus',
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="danger" size="sm" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
    </Modal>
  );
}

/* ------------------------------------------------------------------
 * Toast
 * ------------------------------------------------------------------ */
type Toast = { id: number; type: 'success' | 'error'; message: string };
const ToastContext = createContext<(type: Toast['type'], message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((type: Toast['type'], message: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex max-w-md items-center gap-3 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/90 dark:bg-[#0a0a0a]/90 px-5 py-3 text-sm shadow-2xl shadow-black/10 dark:shadow-black/50 backdrop-blur-xl"
            >
              {t.type === 'success' ? (
                <CheckCircle size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle size={16} className="shrink-0 text-red-600 dark:text-red-400" />
              )}
              <span className="text-neutral-800 dark:text-neutral-200">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const push = useContext(ToastContext);
  return {
    success: (m: string) => push('success', m),
    error: (m: string) => push('error', m),
  };
}

/* ------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------ */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMonthYear(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  });
}

/** String kosong -> null; tambahkan https:// jika user lupa menulis protokol */
export function cleanUrl(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export function emptyToNull(v: string): string | null {
  const s = v.trim();
  return s === '' ? null : s;
}

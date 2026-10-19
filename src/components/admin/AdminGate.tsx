'use client';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Eye, EyeOff, LogOut, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin-queries';
import ThemeToggle from '@/components/ThemeToggle';
import AdminShell from './AdminShell';
import { Button, Field, Spinner, TextInput } from './ui';

type AdminCheck = { userId: string; isAdmin: boolean; error: string | null };

/**
 * Gerbang autentikasi dashboard.
 * Catatan keamanan: ini hanya pengaman UI. Yang benar-benar melindungi data
 * adalah Row Level Security di database (lihat supabase-admin.sql).
 */
export default function AdminGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [check, setCheck] = useState<AdminCheck | null>(null);

  // 1) Pantau sesi login
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setSessionLoaded(true);
    });
    // Callback harus sinkron (jangan panggil query Supabase di sini)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setSessionLoaded(true);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // 2) Verifikasi user terdaftar di tabel admins (via RPC is_admin)
  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    checkIsAdmin().then((r) => {
      if (alive) setCheck({ userId, ...r });
    });
    return () => {
      alive = false;
    };
  }, [userId]);

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  if (!supabase) return <Unconfigured />;
  if (!sessionLoaded) return <FullScreen><Spinner size={22} /></FullScreen>;
  if (!session) return <LoginScreen />;

  if (!check || check.userId !== session.user.id) {
    return <FullScreen><Spinner size={22} /></FullScreen>;
  }

  if (check.error || !check.isAdmin) {
    return (
      <Forbidden
        userId={session.user.id}
        email={session.user.email ?? ''}
        error={check.error}
        onSignOut={signOut}
      />
    );
  }

  return (
    <AdminShell email={session.user.email ?? ''} onSignOut={signOut}>
      {children}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */

function FullScreen({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 text-neutral-500">
      <div className="grain-overlay" />
      <div className="vignette" />
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}

function Unconfigured() {
  return (
    <FullScreen>
      <div className="w-full max-w-lg">
        <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-neutral-500">Setup</span>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Supabase belum terhubung
        </h1>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          Isi dua variabel berikut di <code className="font-mono text-sm">.env.local</code>, lalu
          restart <code className="font-mono text-sm">npm run dev</code>.
        </p>
        <pre className="overflow-x-auto rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] p-5 text-xs text-neutral-700 dark:text-neutral-300">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}
        </pre>
      </div>
    </FullScreen>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(
        error.message.toLowerCase().includes('invalid login')
          ? 'Email atau password salah.'
          : error.message
      );
      setLoading(false);
    }
    // Jika sukses, onAuthStateChange di AdminGate otomatis mengganti layar.
  };

  return (
    <FullScreen>
      <span
        aria-hidden
        className="hollow-bg-text pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[22vw] font-bold leading-none tracking-tighter"
      >
        ADMIN
      </span>

      <form onSubmit={submit} className="relative z-10 w-full max-w-sm space-y-6">
        <div>
          <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-neutral-500">
            Dashboard
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Masuk
          </h1>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Khusus pemilik portfolio.
          </p>
        </div>

        <Field label="Email" htmlFor="email">
          <TextInput
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@email.com"
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <TextInput
              id="password"
              type={show ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Masuk
        </Button>
      </form>
    </FullScreen>
  );
}

function Forbidden({
  userId,
  email,
  error,
  onSignOut,
}: {
  userId: string;
  email: string;
  error: string | null;
  onSignOut: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const sql = `INSERT INTO public.admins (user_id) VALUES ('${userId}');`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard bisa diblokir; user bisa salin manual */
    }
  };

  return (
    <FullScreen>
      <div className="w-full max-w-lg">
        <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-neutral-500">
          Akses ditolak
        </span>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {error ? 'Setup belum lengkap' : 'Akun ini bukan admin'}
        </h1>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          {error ??
            `Kamu login sebagai ${email}, tetapi akun ini belum terdaftar sebagai admin. Jalankan query ini di Supabase SQL Editor:`}
        </p>

        {!error && (
          <div className="relative mb-6">
            <pre className="overflow-x-auto rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] p-5 pr-14 text-xs text-neutral-700 dark:text-neutral-300">
              {sql}
            </pre>
            <button
              type="button"
              onClick={copy}
              aria-label="Salin query"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}

        <Button variant="ghost" onClick={onSignOut}>
          <LogOut size={14} /> Keluar
        </Button>
      </div>
    </FullScreen>
  );
}

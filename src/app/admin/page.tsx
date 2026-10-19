'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Database } from 'lucide-react';
import { checkSupabaseConnection } from '@/lib/queries';
import { countRows, listRows, seedInitialData } from '@/lib/admin-queries';
import type { Message } from '@/lib/supabase';
import {
  Button,
  Card,
  LoadingBlock,
  SectionHeader,
  formatDateTime,
  useToast,
} from '@/components/admin/ui';

type Stats = { projects: number; photos: number; skills: number; experiences: number; profiles: number; unread: number };
type Conn = Awaited<ReturnType<typeof checkSupabaseConnection>>;

export default function OverviewPage() {
  const toast = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Message[]>([]);
  const [conn, setConn] = useState<Conn | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    const [projects, photos, skills, experiences, profiles, unread, msgs, connection] = await Promise.all([
      countRows('projects'),
      countRows('photos'),
      countRows('skills'),
      countRows('experiences'),
      countRows('profiles'),
      countRows('messages', { column: 'is_read', value: false }),
      listRows<Message>('messages'),
      checkSupabaseConnection(),
    ]);
    setStats({ projects, photos, skills, experiences, profiles, unread });
    setRecent((msgs.data ?? []).slice(0, 5));
    setConn(connection);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const seed = async () => {
    setSeeding(true);
    const { inserted, errors } = await seedInitialData();
    setSeeding(false);
    if (errors.length) toast.error(errors[0]);
    else {
      const total = inserted.profile + inserted.projects + inserted.skills + inserted.experiences;
      toast.success(total ? `${total} data awal dimasukkan.` : 'Semua tabel sudah berisi data.');
    }
    await load();
  };

  if (!stats) return <LoadingBlock />;

  const isEmpty =
    stats.projects === 0 || stats.skills === 0 || stats.experiences === 0 || stats.profiles === 0;

  const cards = [
    { label: 'Projects', value: stats.projects, href: '/admin/projects' },
    { label: 'Photography', value: stats.photos, href: '/admin/photography' },
    { label: 'Skills', value: stats.skills, href: '/admin/skills' },
    { label: 'Experience', value: stats.experiences, href: '/admin/experience' },
    { label: 'Pesan baru', value: stats.unread, href: '/admin/messages' },
  ];

  return (
    <>
      <SectionHeader
        tag="/ 00 — overview"
        title="Dashboard"
        subtitle="Kelola konten portfolio kamu. Perubahan tersimpan langsung ke Supabase."
        action={
          conn && (
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-wider ${
                conn.isConnected
                  ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'border-red-500/30 text-red-700 dark:text-red-400'
              }`}
              title={conn.message}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${conn.isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}
              />
              {conn.isConnected ? `Terhubung · ${conn.latencyMs}ms` : 'Tidak terhubung'}
            </span>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group">
            <Card className="p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-black/20 dark:group-hover:border-white/20 group-hover:shadow-md group-hover:shadow-black/5 dark:group-hover:shadow-black/30">
              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-wider text-neutral-500">{c.label}</span>
                <ArrowUpRight
                  size={14}
                  className="text-neutral-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-white"
                />
              </div>
              <p className="mt-6 text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {c.value}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {isEmpty && (
        <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-start gap-4">
            <Database size={20} className="mt-0.5 shrink-0 text-neutral-500" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">
                Beberapa tabel masih kosong
              </p>
              <p className="mt-1 max-w-lg text-sm text-neutral-600 dark:text-neutral-400">
                Website kamu sedang menampilkan data cadangan lokal. Salin data tersebut ke
                database supaya bisa diedit dari sini. Hanya tabel yang kosong yang diisi.
              </p>
            </div>
          </div>
          <Button loading={seeding} onClick={seed}>
            Isi data awal
          </Button>
        </Card>
      )}

      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Pesan terbaru
          </h2>
          <Link
            href="/admin/messages"
            className="text-[11px] uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            Lihat semua
          </Link>
        </div>

        {recent.length === 0 ? (
          <Card className="px-6 py-10 text-center text-sm text-neutral-500">
            Belum ada pesan dari form kontak.
          </Card>
        ) : (
          <Card className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {recent.map((m) => (
              <Link
                key={m.id}
                href="/admin/messages"
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${m.is_read ? 'bg-transparent' : 'bg-red-500'}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                    {m.name} <span className="font-normal text-neutral-500">— {m.subject}</span>
                  </p>
                  <p className="truncate text-xs text-neutral-500">{m.message}</p>
                </div>
                <span className="hidden shrink-0 text-[11px] text-neutral-500 sm:block">
                  {formatDateTime(m.created_at)}
                </span>
              </Link>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}

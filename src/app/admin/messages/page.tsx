'use client';
import { useMemo, useState } from 'react';
import { ArrowLeft, Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import type { Message } from '@/lib/supabase';
import { deleteRow, updateRow } from '@/lib/admin-queries';
import { useRows } from '@/components/admin/hooks';
import { MESSAGES_CHANGED } from '@/components/admin/AdminShell';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  LoadingBlock,
  SectionHeader,
  Segmented,
  formatDateTime,
  useToast,
} from '@/components/admin/ui';

export default function MessagesPage() {
  const toast = useToast();
  const { rows, setRows, loading, error, reload } = useRows<Message>('messages');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  const visible = useMemo(
    () => (filter === 'unread' ? rows.filter((m) => !m.is_read) : rows),
    [rows, filter]
  );
  const selected = rows.find((m) => m.id === selectedId) ?? null;
  const unreadCount = rows.filter((m) => !m.is_read).length;

  const notify = () => window.dispatchEvent(new Event(MESSAGES_CHANGED));

  const setRead = async (m: Message, is_read: boolean) => {
    setRows((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read } : x))); // optimistic
    const { error } = await updateRow('messages', m.id, { is_read });
    if (error) {
      toast.error(error);
      await reload();
    }
    notify();
  };

  const open = (m: Message) => {
    setSelectedId(m.id);
    if (!m.is_read) setRead(m, true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error } = await deleteRow('messages', toDelete.id);
    setDeleting(false);
    if (error) toast.error(error);
    else {
      toast.success('Pesan dihapus.');
      if (selectedId === toDelete.id) setSelectedId(null);
    }
    setToDelete(null);
    await reload();
    notify();
  };

  return (
    <>
      <SectionHeader
        tag="/ 04 — inbox"
        title="Messages"
        subtitle={`Pesan dari form kontak website. ${unreadCount} belum dibaca.`}
        action={
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'Semua' },
              { value: 'unread', label: 'Belum dibaca' },
            ]}
          />
        }
      />

      {error && <ErrorBanner message={error} onRetry={reload} />}
      {loading && rows.length === 0 ? (
        <LoadingBlock />
      ) : visible.length === 0 && !error ? (
        <EmptyState
          title={filter === 'unread' ? 'Tidak ada pesan baru' : 'Inbox kosong'}
          description="Pesan dari form kontak akan muncul di sini."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Daftar pesan */}
          <Card
            className={`divide-y divide-black/[0.06] dark:divide-white/[0.06] overflow-hidden ${
              selected ? 'hidden lg:block' : ''
            }`}
          >
            {visible.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => open(m)}
                className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors cursor-pointer ${
                  selectedId === m.id
                    ? 'bg-black/[0.04] dark:bg-white/[0.06]'
                    : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                }`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.is_read ? 'bg-transparent' : 'bg-red-500'}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={`truncate text-sm text-neutral-900 dark:text-white ${m.is_read ? 'font-medium' : 'font-bold'}`}
                    >
                      {m.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-neutral-500">
                      {new Date(m.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <p className="truncate text-sm text-neutral-700 dark:text-neutral-300">{m.subject}</p>
                  <p className="truncate text-xs text-neutral-500">{m.message}</p>
                </div>
              </button>
            ))}
          </Card>

          {/* Detail */}
          <div className={selected ? '' : 'hidden lg:block'}>
            {selected ? (
              <Card className="p-6 sm:p-8">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white lg:hidden cursor-pointer"
                >
                  <ArrowLeft size={14} /> Kembali
                </button>

                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {selected.subject}
                </h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {selected.name} ·{' '}
                  <a
                    href={`mailto:${selected.email}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {selected.email}
                  </a>
                </p>
                <p className="mt-1 text-xs text-neutral-500">{formatDateTime(selected.created_at)}</p>

                {/* Isi pesan dirender sebagai teks biasa (React meng-escape otomatis) */}
                <p className="mt-8 whitespace-pre-wrap break-words text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                  {selected.message}
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white transition-all duration-300 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    <Reply size={13} /> Balas
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRead(selected, !selected.is_read)}
                  >
                    {selected.is_read ? <Mail size={13} /> : <MailOpen size={13} />}
                    {selected.is_read ? 'Tandai belum dibaca' : 'Tandai dibaca'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setToDelete(selected)}>
                    <Trash2 size={13} /> Hapus
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="flex h-full min-h-[18rem] items-center justify-center rounded-2xl border border-dashed border-black/[0.12] dark:border-white/[0.1] text-sm text-neutral-500">
                Pilih pesan untuk membacanya
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus pesan?"
        description={`Pesan dari ${toDelete?.name ?? ''} akan dihapus permanen.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

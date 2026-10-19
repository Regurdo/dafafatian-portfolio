'use client';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Skill } from '@/lib/supabase';
import { deleteRow, insertRow, nextOrderIndex, swapOrder, updateRow } from '@/lib/admin-queries';
import { useRows } from '@/components/admin/hooks';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  Field,
  IconButton,
  LoadingBlock,
  Modal,
  SectionHeader,
  TextInput,
  useToast,
} from '@/components/admin/ui';

type Form = { name: string; category: string; proficiency: number };
const EMPTY: Form = { name: '', category: '', proficiency: 80 };

export default function SkillsPage() {
  const toast = useToast();
  const { rows, loading, error, reload } = useRows<Skill>('skills');
  const [editing, setEditing] = useState<Skill | 'new' | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = useMemo(() => Array.from(new Set(rows.map((r) => r.category))), [rows]);
  const grouped = useMemo(
    () => categories.map((c) => ({ category: c, items: rows.filter((r) => r.category === c) })),
    [rows, categories]
  );

  const openNew = () => {
    setForm({ ...EMPTY, category: categories[0] ?? '' });
    setEditing('new');
  };
  const openEdit = (s: Skill) => {
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency });
    setEditing(s);
  };
  const close = () => setEditing(null);

  const save = async () => {
    if (!form.name.trim() || !form.category.trim()) {
      toast.error('Nama dan kategori wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      proficiency: Math.min(100, Math.max(0, Math.round(form.proficiency))),
    };
    const res =
      editing === 'new'
        ? await insertRow<Skill>('skills', { ...payload, order_index: nextOrderIndex(rows) })
        : editing
        ? await updateRow<Skill>('skills', editing.id, payload)
        : null;
    setSaving(false);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success(editing === 'new' ? 'Skill ditambahkan.' : 'Perubahan disimpan.');
    close();
    await reload();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error } = await deleteRow('skills', toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (error) toast.error(error);
    else toast.success('Skill dihapus.');
    await reload();
  };

  /** Pindah posisi dalam kategori yang sama */
  const move = async (items: Skill[], index: number, dir: -1 | 1) => {
    const other = items[index + dir];
    if (!other) return;
    const { error } = await swapOrder('skills', rows, items[index].id, other.id);
    if (error) toast.error(error);
    await reload();
  };

  return (
    <>
      <SectionHeader
        tag="/ 02 — skills"
        title="Skills"
        subtitle="Dikelompokkan per kategori. Ikon di website otomatis mengikuti nama skill."
        action={
          <Button onClick={openNew}>
            <Plus size={14} /> Skill baru
          </Button>
        }
      />

      {error && <ErrorBanner message={error} onRetry={reload} />}
      {loading && rows.length === 0 ? (
        <LoadingBlock />
      ) : rows.length === 0 && !error ? (
        <EmptyState
          title="Belum ada skill"
          action={
            <Button onClick={openNew}>
              <Plus size={14} /> Skill baru
            </Button>
          }
        />
      ) : (
        <div className="space-y-10">
          {grouped.map(({ category, items }) => (
            <section key={category}>
              <h2 className="mb-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
                {category} <span className="text-neutral-400">· {items.length}</span>
              </h2>
              <Card className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                {items.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                          {s.name}
                        </span>
                        <span className="shrink-0 rounded-full border border-black/[0.05] dark:border-white/[0.05] bg-black/[0.04] dark:bg-white/[0.06] px-2.5 py-0.5 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                          {s.proficiency}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-neutral-900 dark:bg-white"
                          style={{ width: `${s.proficiency}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <IconButton label="Naik" disabled={i === 0} onClick={() => move(items, i, -1)}>
                        <ArrowUp size={15} />
                      </IconButton>
                      <IconButton
                        label="Turun"
                        disabled={i === items.length - 1}
                        onClick={() => move(items, i, 1)}
                      >
                        <ArrowDown size={15} />
                      </IconButton>
                      <IconButton label="Edit" onClick={() => openEdit(s)}>
                        <Pencil size={15} />
                      </IconButton>
                      <IconButton
                        label="Hapus"
                        onClick={() => setToDelete(s)}
                        className="hover:!text-red-600 dark:hover:!text-red-400"
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </Card>
            </section>
          ))}
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={close}
        title={editing === 'new' ? 'Skill baru' : 'Edit skill'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={close}>
              Batal
            </Button>
            <Button size="sm" loading={saving} onClick={save}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <Field label="Nama *" htmlFor="s-name" hint="Contoh: React / Next.js, Docker, Figma">
            <TextInput
              id="s-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Kategori *" htmlFor="s-cat" hint="Pilih yang ada atau ketik kategori baru.">
            <TextInput
              id="s-cat"
              list="skill-categories"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Frontend"
            />
            <datalist id="skill-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label={`Tingkat penguasaan — ${form.proficiency}%`} htmlFor="s-prof">
            <input
              id="s-prof"
              type="range"
              min={0}
              max={100}
              step={1}
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
              className="w-full accent-neutral-900 dark:accent-white"
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus skill?"
        description={`“${toDelete?.name ?? ''}” akan dihapus permanen.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

'use client';
import { useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Experience } from '@/lib/supabase';
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
  Segmented,
  TextArea,
  TextInput,
  Toggle,
  chipClass,
  emptyToNull,
  formatMonthYear,
  useToast,
} from '@/components/admin/ui';

type Form = {
  type: 'work' | 'education';
  title: string;
  company: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
};

const EMPTY: Form = {
  type: 'work',
  title: '',
  company: '',
  location: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: false,
};

export default function ExperiencePage() {
  const toast = useToast();
  const { rows, loading, error, reload } = useRows<Experience>('experiences');
  const [editing, setEditing] = useState<Experience | 'new' | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Experience | null>(null);
  const [deleting, setDeleting] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setForm(EMPTY);
    setEditing('new');
  };
  const openEdit = (e: Experience) => {
    setForm({
      type: e.type,
      title: e.title,
      company: e.company,
      location: e.location ?? '',
      description: e.description,
      start_date: e.start_date,
      end_date: e.end_date ?? '',
      is_current: e.is_current,
    });
    setEditing(e);
  };
  const close = () => setEditing(null);

  const save = async () => {
    if (!form.title.trim() || !form.company.trim() || !form.description.trim() || !form.start_date) {
      toast.error('Judul, instansi, deskripsi, dan tanggal mulai wajib diisi.');
      return;
    }
    if (!form.is_current && form.end_date && form.end_date < form.start_date) {
      toast.error('Tanggal selesai tidak boleh sebelum tanggal mulai.');
      return;
    }
    setSaving(true);
    const payload = {
      type: form.type,
      title: form.title.trim(),
      company: form.company.trim(),
      location: emptyToNull(form.location),
      description: form.description.trim(),
      start_date: form.start_date,
      end_date: form.is_current ? null : emptyToNull(form.end_date),
      is_current: form.is_current,
    };
    const res =
      editing === 'new'
        ? await insertRow<Experience>('experiences', { ...payload, order_index: nextOrderIndex(rows) })
        : editing
        ? await updateRow<Experience>('experiences', editing.id, payload)
        : null;
    setSaving(false);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success(editing === 'new' ? 'Pengalaman ditambahkan.' : 'Perubahan disimpan.');
    close();
    await reload();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error } = await deleteRow('experiences', toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (error) toast.error(error);
    else toast.success('Pengalaman dihapus.');
    await reload();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const other = rows[index + dir];
    if (!other) return;
    const { error } = await swapOrder('experiences', rows, rows[index].id, other.id);
    if (error) toast.error(error);
    await reload();
  };

  return (
    <>
      <SectionHeader
        tag="/ 03 — experience"
        title="Experience"
        subtitle="Pengalaman kerja dan pendidikan, urut sesuai tampilan di website."
        action={
          <Button onClick={openNew}>
            <Plus size={14} /> Tambah baru
          </Button>
        }
      />

      {error && <ErrorBanner message={error} onRetry={reload} />}
      {loading && rows.length === 0 ? (
        <LoadingBlock />
      ) : rows.length === 0 && !error ? (
        <EmptyState
          title="Belum ada pengalaman"
          action={
            <Button onClick={openNew}>
              <Plus size={14} /> Tambah baru
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {rows.map((e, i) => (
            <Card key={e.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={chipClass}>{e.type === 'work' ? 'Kerja' : 'Pendidikan'}</span>
                  {e.is_current && (
                    <span className="rounded-full border border-emerald-500/30 px-2.5 py-1 text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Sekarang
                    </span>
                  )}
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500">
                    {formatMonthYear(e.start_date)} —{' '}
                    {e.is_current ? 'Sekarang' : e.end_date ? formatMonthYear(e.end_date) : '—'}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                  {e.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {e.company}
                  {e.location ? ` · ${e.location}` : ''}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{e.description}</p>
              </div>
              <div className="flex items-center gap-0.5 self-end sm:self-start">
                <IconButton label="Naik" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp size={15} />
                </IconButton>
                <IconButton label="Turun" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
                  <ArrowDown size={15} />
                </IconButton>
                <IconButton label="Edit" onClick={() => openEdit(e)}>
                  <Pencil size={15} />
                </IconButton>
                <IconButton
                  label="Hapus"
                  onClick={() => setToDelete(e)}
                  className="hover:!text-red-600 dark:hover:!text-red-400"
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={close}
        wide
        title={editing === 'new' ? 'Pengalaman baru' : 'Edit pengalaman'}
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
          <Segmented
            value={form.type}
            onChange={(v) => set('type', v)}
            options={[
              { value: 'work', label: 'Pekerjaan' },
              { value: 'education', label: 'Pendidikan' },
            ]}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label={form.type === 'work' ? 'Posisi *' : 'Jurusan / Gelar *'}
              htmlFor="e-title"
            >
              <TextInput
                id="e-title"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </Field>
            <Field
              label={form.type === 'work' ? 'Perusahaan *' : 'Institusi *'}
              htmlFor="e-company"
            >
              <TextInput
                id="e-company"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Lokasi" htmlFor="e-loc">
            <TextInput
              id="e-loc"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="Jakarta, Indonesia"
            />
          </Field>

          <Field label="Deskripsi *" htmlFor="e-desc">
            <TextArea
              id="e-desc"
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Mulai *" htmlFor="e-start">
              <TextInput
                id="e-start"
                type="date"
                value={form.start_date}
                onChange={(e) => set('start_date', e.target.value)}
              />
            </Field>
            <Field label="Selesai" htmlFor="e-end">
              <TextInput
                id="e-end"
                type="date"
                disabled={form.is_current}
                value={form.is_current ? '' : form.end_date}
                onChange={(e) => set('end_date', e.target.value)}
              />
            </Field>
          </div>

          <Toggle
            checked={form.is_current}
            onChange={(v) => set('is_current', v)}
            label="Masih berlangsung"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus pengalaman?"
        description={`“${toDelete?.title ?? ''}” di ${toDelete?.company ?? ''} akan dihapus permanen.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

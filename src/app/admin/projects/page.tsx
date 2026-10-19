'use client';
import { useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import type { Project } from '@/lib/supabase';
import {
  deleteImageByUrl,
  deleteRow,
  insertRow,
  nextOrderIndex,
  swapOrder,
  updateRow,
} from '@/lib/admin-queries';
import { useRows } from '@/components/admin/hooks';
import ImageUpload from '@/components/admin/ImageUpload';
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
  TagInput,
  TextArea,
  TextInput,
  Toggle,
  chipClass,
  cleanUrl,
  emptyToNull,
  useToast,
} from '@/components/admin/ui';

type Form = {
  title: string;
  description: string;
  long_description: string;
  category: string;
  tech_stack: string[];
  live_url: string;
  github_url: string;
  image_url: string | null;
  featured: boolean;
};

const EMPTY: Form = {
  title: '',
  description: '',
  long_description: '',
  category: '',
  tech_stack: [],
  live_url: '',
  github_url: '',
  image_url: null,
  featured: false,
};

const toForm = (p: Project): Form => ({
  title: p.title,
  description: p.description,
  long_description: p.long_description ?? '',
  category: p.category,
  tech_stack: p.tech_stack ?? [],
  live_url: p.live_url ?? '',
  github_url: p.github_url ?? '',
  image_url: p.image_url,
  featured: p.featured,
});

export default function ProjectsPage() {
  const toast = useToast();
  const { rows, loading, error, reload } = useRows<Project>('projects');
  const [editing, setEditing] = useState<Project | 'new' | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openNew = () => {
    setForm(EMPTY);
    setEditing('new');
  };
  const openEdit = (p: Project) => {
    setForm(toForm(p));
    setEditing(p);
  };
  const close = () => setEditing(null);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Judul dan deskripsi singkat wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      long_description: emptyToNull(form.long_description),
      category: form.category.trim() || 'General',
      tech_stack: form.tech_stack,
      live_url: cleanUrl(form.live_url),
      github_url: cleanUrl(form.github_url),
      image_url: form.image_url,
      featured: form.featured,
    };

    if (editing === 'new') {
      const { error } = await insertRow<Project>('projects', {
        ...payload,
        order_index: nextOrderIndex(rows),
      });
      if (error) toast.error(error);
      else toast.success('Project ditambahkan.');
      if (!error) close();
    } else if (editing) {
      const { error } = await updateRow<Project>('projects', editing.id, payload);
      if (error) toast.error(error);
      else {
        if (editing.image_url && editing.image_url !== form.image_url) {
          await deleteImageByUrl(editing.image_url);
        }
        toast.success('Perubahan disimpan.');
        close();
      }
    }
    setSaving(false);
    await reload();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error } = await deleteRow('projects', toDelete.id);
    if (error) toast.error(error);
    else {
      await deleteImageByUrl(toDelete.image_url);
      toast.success('Project dihapus.');
    }
    setDeleting(false);
    setToDelete(null);
    await reload();
  };

  const toggleFeatured = async (p: Project) => {
    const { error } = await updateRow('projects', p.id, { featured: !p.featured });
    if (error) toast.error(error);
    await reload();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const other = rows[index + dir];
    if (!other) return;
    const { error } = await swapOrder('projects', rows, rows[index].id, other.id);
    if (error) toast.error(error);
    await reload();
  };

  return (
    <>
      <SectionHeader
        tag="/ 01 — projects"
        title="Projects"
        subtitle="Urutan di sini sama dengan urutan kartu yang menumpuk di website."
        action={
          <Button onClick={openNew}>
            <Plus size={14} /> Project baru
          </Button>
        }
      />

      {error && <ErrorBanner message={error} onRetry={reload} />}
      {loading && rows.length === 0 ? (
        <LoadingBlock />
      ) : rows.length === 0 && !error ? (
        <EmptyState
          title="Belum ada project"
          description="Tambahkan project pertamamu, atau isi data awal dari halaman Overview."
          action={
            <Button onClick={openNew}>
              <Plus size={14} /> Project baru
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {rows.map((p, i) => (
            <Card key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 sm:w-40">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center px-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600">
                    {p.category}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                    {p.title}
                  </h3>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500">
                    {p.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {p.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tech_stack.slice(0, 4).map((t) => (
                    <span key={t} className={chipClass}>
                      {t}
                    </span>
                  ))}
                  {p.tech_stack.length > 4 && (
                    <span className="px-1 py-1 text-[10px] text-neutral-500">
                      +{p.tech_stack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-0.5 self-end sm:self-center">
                <IconButton
                  label={p.featured ? 'Hapus dari featured' : 'Jadikan featured'}
                  onClick={() => toggleFeatured(p)}
                  className={p.featured ? '!text-amber-500' : ''}
                >
                  <Star size={15} fill={p.featured ? 'currentColor' : 'none'} />
                </IconButton>
                {p.live_url && (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Buka live demo"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
                <IconButton label="Naik" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp size={15} />
                </IconButton>
                <IconButton label="Turun" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
                  <ArrowDown size={15} />
                </IconButton>
                <IconButton label="Edit" onClick={() => openEdit(p)}>
                  <Pencil size={15} />
                </IconButton>
                <IconButton
                  label="Hapus"
                  onClick={() => setToDelete(p)}
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
        title={editing === 'new' ? 'Project baru' : 'Edit project'}
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
          <Field label="Gambar cover">
            <ImageUpload
              folder="projects"
              value={form.image_url}
              onChange={(url) => set('image_url', url)}
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Judul *" htmlFor="p-title">
              <TextInput
                id="p-title"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Nama project"
              />
            </Field>
            <Field label="Kategori" htmlFor="p-cat" hint="Contoh: Full Stack, AI/ML, UI Design">
              <TextInput
                id="p-cat"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                placeholder="General"
              />
            </Field>
          </div>

          <Field label="Deskripsi singkat *" htmlFor="p-desc" hint="Tampil di kartu project.">
            <TextArea
              id="p-desc"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>

          <Field label="Deskripsi lengkap" htmlFor="p-long" hint="Tampil di jendela detail project.">
            <TextArea
              id="p-long"
              rows={5}
              value={form.long_description}
              onChange={(e) => set('long_description', e.target.value)}
            />
          </Field>

          <Field label="Tech stack" hint="Ketik lalu tekan Enter atau koma.">
            <TagInput
              value={form.tech_stack}
              onChange={(v) => set('tech_stack', v)}
              placeholder="Next.js, TypeScript…"
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Live URL" htmlFor="p-live">
              <TextInput
                id="p-live"
                value={form.live_url}
                onChange={(e) => set('live_url', e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <Field label="GitHub URL" htmlFor="p-gh">
              <TextInput
                id="p-gh"
                value={form.github_url}
                onChange={(e) => set('github_url', e.target.value)}
                placeholder="https://github.com/…"
              />
            </Field>
          </div>

          <Toggle
            checked={form.featured}
            onChange={(v) => set('featured', v)}
            label="Tandai sebagai featured"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus project?"
        description={`“${toDelete?.title ?? ''}” akan dihapus permanen beserta gambar covernya.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

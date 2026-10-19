'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import type { PhotoRow } from '@/lib/photos';
import {
  deleteImageByUrl,
  deleteRow,
  insertRow,
  nextOrderIndex,
  seedPhotos,
  swapOrder,
  updateRow,
  uploadImage,
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
  TextInput,
  useToast,
} from '@/components/admin/ui';

type Form = {
  url: string | null;
  title: string;
  category: string;
  camera: string;
  lens: string;
  iso: string;
  shutter: string;
  aperture: string;
};

const EMPTY: Form = {
  url: null,
  title: '',
  category: '',
  camera: '',
  lens: '',
  iso: '',
  shutter: '',
  aperture: '',
};

const toForm = (p: PhotoRow): Form => ({
  url: p.url,
  title: p.title,
  category: p.category,
  camera: p.camera,
  lens: p.lens,
  iso: p.iso,
  shutter: p.shutter,
  aperture: p.aperture,
});

export default function PhotographyAdminPage() {
  const toast = useToast();
  const { rows, loading, error, reload } = useRows<PhotoRow>('photos');
  const [editing, setEditing] = useState<PhotoRow | 'new' | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<PhotoRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null);
  const bulkRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setForm(EMPTY);
    setEditing('new');
  };
  const openEdit = (p: PhotoRow) => {
    setForm(toForm(p));
    setEditing(p);
  };
  const close = () => setEditing(null);

  const save = async () => {
    if (!form.url) {
      toast.error('Unggah fotonya dulu.');
      return;
    }
    if (!form.title.trim()) {
      toast.error('Judul foto wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      url: form.url,
      title: form.title.trim(),
      category: form.category.trim(),
      camera: form.camera.trim(),
      lens: form.lens.trim(),
      iso: form.iso.trim(),
      shutter: form.shutter.trim(),
      aperture: form.aperture.trim(),
    };

    const res =
      editing === 'new'
        ? await insertRow<PhotoRow>('photos', { ...payload, order_index: nextOrderIndex(rows) })
        : editing
        ? await updateRow<PhotoRow>('photos', editing.id, payload)
        : null;
    setSaving(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }
    if (editing && editing !== 'new' && editing.url !== form.url) {
      await deleteImageByUrl(editing.url); // foto lama yang diganti
    }
    toast.success(editing === 'new' ? 'Foto ditambahkan.' : 'Perubahan disimpan.');
    close();
    await reload();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error } = await deleteRow('photos', toDelete.id);
    if (error) toast.error(error);
    else {
      await deleteImageByUrl(toDelete.url);
      toast.success('Foto dihapus.');
    }
    setDeleting(false);
    setToDelete(null);
    await reload();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const other = rows[index + dir];
    if (!other) return;
    const { error } = await swapOrder('photos', rows, rows[index].id, other.id);
    if (error) toast.error(error);
    await reload();
  };

  const seed = async () => {
    setSeeding(true);
    const { inserted, error } = await seedPhotos();
    setSeeding(false);
    if (error) toast.error(error);
    else toast.success(`${inserted} foto contoh dimasukkan. Ganti satu per satu dengan fotomu.`);
    await reload();
  };

  /** Pilih banyak foto sekaligus: tiap file jadi satu entri, detailnya diedit belakangan */
  const bulkUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setBulk({ done: 0, total: list.length });
    let order = nextOrderIndex(rows);
    let ok = 0;
    const errors: string[] = [];

    for (const file of list) {
      const up = await uploadImage(file, 'photography');
      if (up.error || !up.data) {
        errors.push(`${file.name}: ${up.error ?? 'upload gagal'}`);
      } else {
        const title =
          file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Untitled';
        const ins = await insertRow<PhotoRow>('photos', {
          title,
          category: '',
          url: up.data,
          camera: '',
          lens: '',
          iso: '',
          shutter: '',
          aperture: '',
          order_index: order,
        });
        if (ins.error) {
          errors.push(`${file.name}: ${ins.error}`);
          await deleteImageByUrl(up.data);
        } else {
          order += 1;
          ok += 1;
        }
      }
      setBulk((b) => (b ? { ...b, done: b.done + 1 } : b));
    }

    setBulk(null);
    if (ok) toast.success(`${ok} foto diunggah. Klik edit untuk mengisi judul dan EXIF.`);
    if (errors.length) toast.error(errors[0] + (errors.length > 1 ? ` (+${errors.length - 1} lainnya)` : ''));
    await reload();
  };

  return (
    <>
      <SectionHeader
        tag="/ 02 — photography"
        title="Photography"
        subtitle="Urutan di sini sama dengan urutan frame di kamera pada website. Foto otomatis diperkecil ke maks 2400px sebelum diunggah."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" loading={bulk !== null} onClick={() => bulkRef.current?.click()}>
              <ImagePlus size={14} />
              {bulk ? `Mengunggah ${bulk.done}/${bulk.total}` : 'Unggah banyak'}
            </Button>
            <Button onClick={openNew}>
              <Plus size={14} /> Foto baru
            </Button>
            <input
              ref={bulkRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                bulkUpload(e.target.files);
                e.target.value = '';
              }}
            />
          </div>
        }
      />

      {error && (
        <ErrorBanner
          message={
            error.includes('photos') && error.toLowerCase().includes('exist')
              ? 'Tabel photos belum ada. Jalankan supabase-photography.sql di Supabase SQL Editor.'
              : error
          }
          onRetry={reload}
        />
      )}

      {loading && rows.length === 0 ? (
        <LoadingBlock />
      ) : rows.length === 0 && !error ? (
        <EmptyState
          title="Belum ada foto di database"
          description="Website sedang menampilkan 10 foto contoh bawaan. Mulai dari foto sendiri, atau salin foto contoh ke database supaya bisa kamu ganti satu per satu."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={openNew}>
                <Plus size={14} /> Foto baru
              </Button>
              <Button variant="ghost" loading={seeding} onClick={seed}>
                Salin foto contoh
              </Button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p, i) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="relative aspect-[4/3] bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-4">
                <h3 className="truncate text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="truncate text-xs uppercase tracking-wider text-neutral-500">
                  {p.category || 'Tanpa kategori'}
                </p>
                <p className="mt-1 truncate text-xs text-neutral-500">
                  {[p.camera, p.lens].filter(Boolean).join(' · ') || 'EXIF belum diisi'}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    <IconButton label="Geser ke depan" disabled={i === 0} onClick={() => move(i, -1)}>
                      <ArrowLeft size={15} />
                    </IconButton>
                    <IconButton
                      label="Geser ke belakang"
                      disabled={i === rows.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      <ArrowRight size={15} />
                    </IconButton>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <IconButton label="Edit / ganti foto" onClick={() => openEdit(p)}>
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={close}
        wide
        title={editing === 'new' ? 'Foto baru' : 'Edit foto'}
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
          <Field label="Foto *">
            <ImageUpload
              folder="photography"
              value={form.url}
              onChange={(url) => set('url', url)}
              aspect="aspect-[4/3]"
              hint="JPG, PNG, WebP · maks 40 MB · otomatis dikompres"
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Judul *" htmlFor="ph-title">
              <TextInput
                id="ph-title"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Shinjuku Rain"
              />
            </Field>
            <Field label="Kategori" htmlFor="ph-cat">
              <TextInput
                id="ph-cat"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                placeholder="Street / Night City"
              />
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Kamera" htmlFor="ph-cam">
              <TextInput
                id="ph-cam"
                value={form.camera}
                onChange={(e) => set('camera', e.target.value)}
                placeholder="Sony A7 IV"
              />
            </Field>
            <Field label="Lensa" htmlFor="ph-lens">
              <TextInput
                id="ph-lens"
                value={form.lens}
                onChange={(e) => set('lens', e.target.value)}
                placeholder="35mm f/1.4 GM"
              />
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field label="ISO" htmlFor="ph-iso">
              <TextInput
                id="ph-iso"
                value={form.iso}
                onChange={(e) => set('iso', e.target.value)}
                placeholder="ISO 100"
              />
            </Field>
            <Field label="Shutter" htmlFor="ph-shutter">
              <TextInput
                id="ph-shutter"
                value={form.shutter}
                onChange={(e) => set('shutter', e.target.value)}
                placeholder="1/250s"
              />
            </Field>
            <Field label="Aperture" htmlFor="ph-ap">
              <TextInput
                id="ph-ap"
                value={form.aperture}
                onChange={(e) => set('aperture', e.target.value)}
                placeholder="f/1.8"
              />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus foto?"
        description={`“${toDelete?.title ?? ''}” akan dihapus permanen beserta file gambarnya.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

'use client';
import { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { deleteImageByUrl, uploadImage, type UploadFolder } from '@/lib/admin-queries';
import { Spinner, useToast } from './ui';

/**
 * Upload gambar ke Supabase Storage (bucket "portfolio").
 * Gambar yang diunggah di sesi ini lalu diganti/dihapus sebelum disimpan
 * langsung dibersihkan dari bucket agar tidak ada file yatim.
 */
export default function ImageUpload({
  value,
  onChange,
  folder,
  aspect = 'aspect-video',
  rounded = 'rounded-2xl',
  hint,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: UploadFolder;
  aspect?: string;
  rounded?: string;
  hint?: string;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionUploads = useRef<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const cleanupIfSessionUpload = async (url: string | null) => {
    if (url && sessionUploads.current.has(url)) {
      sessionUploads.current.delete(url);
      await deleteImageByUrl(url);
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    const { data, error } = await uploadImage(file, folder);
    setUploading(false);
    if (error || !data) {
      toast.error(error ?? 'Upload gagal.');
      return;
    }
    await cleanupIfSessionUpload(value);
    sessionUploads.current.add(data);
    onChange(data);
  };

  const remove = async () => {
    await cleanupIfSessionUpload(value);
    onChange(null);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative ${aspect} w-full overflow-hidden ${rounded} border border-dashed transition-colors ${
          dragging
            ? 'border-neutral-900 dark:border-white bg-black/[0.04] dark:bg-white/[0.06]'
            : 'border-black/[0.12] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02]'
        }`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ImagePlus size={22} />
            <span className="text-xs uppercase tracking-wider">Klik atau seret gambar</span>
            <span className="text-[11px] text-neutral-500">
              {hint ?? (folder === 'photography' ? 'JPG, PNG, WebP · maks 40 MB · otomatis dikompres' : 'JPG, PNG, WebP · maks 5 MB')}
            </span>
          </button>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white backdrop-blur-sm">
            <Spinner size={22} />
          </div>
        )}
      </div>

      {value && (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-black/[0.1] dark:border-white/[0.1] px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            Ganti
          </button>
          <button
            type="button"
            onClick={remove}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 size={12} /> Hapus
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

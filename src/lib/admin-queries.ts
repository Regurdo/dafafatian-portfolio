import { supabase } from './supabase';
import type { Profile, Project, Skill, Experience } from './supabase';
import { fallbackProfile, fallbackProjects, fallbackSkills, fallbackExperiences } from './data';
import { fallbackPhotos } from './photos';

/**
 * Query khusus dashboard admin.
 * Beda dengan queries.ts: TIDAK memakai data fallback (supaya admin selalu
 * melihat isi database yang sebenarnya) dan memeriksa apakah baris benar-benar
 * berubah (RLS yang menolak akses tidak menghasilkan error di PostgREST).
 */

export type TableName = 'profiles' | 'projects' | 'skills' | 'experiences' | 'messages' | 'photos';
export type UploadFolder = 'projects' | 'profile' | 'photography';
export type Result<T> = { data: T | null; error: string | null };

const NOT_CONFIGURED =
  'Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local lalu restart dev server.';

const ORDER: Record<TableName, { column: string; ascending: boolean }> = {
  profiles: { column: 'created_at', ascending: true },
  projects: { column: 'order_index', ascending: true },
  skills: { column: 'order_index', ascending: true },
  experiences: { column: 'order_index', ascending: true },
  photos: { column: 'order_index', ascending: true },
  messages: { column: 'created_at', ascending: false },
};

const NO_ROW =
  'Tidak ada baris yang berubah. Kemungkinan akun ini belum terdaftar sebagai admin atau data sudah dihapus.';

export async function listRows<T>(table: TableName): Promise<Result<T[]>> {
  if (!supabase) return { data: null, error: NOT_CONFIGURED };
  const { column, ascending } = ORDER[table];
  const { data, error } = await supabase.from(table).select('*').order(column, { ascending });
  if (error) return { data: null, error: error.message };
  return { data: (data ?? []) as T[], error: null };
}

export async function insertRow<T>(
  table: TableName,
  values: Record<string, unknown>
): Promise<Result<T>> {
  if (!supabase) return { data: null, error: NOT_CONFIGURED };
  const { data, error } = await supabase.from(table).insert([values]).select();
  if (error) return { data: null, error: error.message };
  if (!data || data.length === 0) return { data: null, error: NO_ROW };
  return { data: data[0] as T, error: null };
}

export async function updateRow<T>(
  table: TableName,
  id: string,
  values: Record<string, unknown>
): Promise<Result<T>> {
  if (!supabase) return { data: null, error: NOT_CONFIGURED };
  const { data, error } = await supabase.from(table).update(values).eq('id', id).select();
  if (error) return { data: null, error: error.message };
  if (!data || data.length === 0) return { data: null, error: NO_ROW };
  return { data: data[0] as T, error: null };
}

export async function deleteRow(table: TableName, id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: NOT_CONFIGURED };
  const { data, error } = await supabase.from(table).delete().eq('id', id).select('id');
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: NO_ROW };
  return { error: null };
}

export async function countRows(
  table: TableName,
  filter?: { column: string; value: boolean | string }
): Promise<number> {
  if (!supabase) return 0;
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) q = q.eq(filter.column, filter.value);
  const { count } = await q;
  return count ?? 0;
}

/**
 * Tukar posisi dua item lalu tulis ulang order_index berurutan (0..n-1).
 * `list` harus sudah terurut sesuai tampilan global (order_index asc).
 */
export async function swapOrder(
  table: 'projects' | 'skills' | 'experiences' | 'photos',
  list: { id: string; order_index: number }[],
  idA: string,
  idB: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: NOT_CONFIGURED };
  const arr = [...list];
  const a = arr.findIndex((x) => x.id === idA);
  const b = arr.findIndex((x) => x.id === idB);
  if (a < 0 || b < 0) return { error: 'Item tidak ditemukan.' };
  [arr[a], arr[b]] = [arr[b], arr[a]];

  const changed = arr
    .map((item, index) => ({ id: item.id, index, was: item.order_index }))
    .filter((x) => x.was !== x.index);

  const results = await Promise.all(
    changed.map((x) => updateRow(table, x.id, { order_index: x.index }))
  );
  const failed = results.find((r) => r.error);
  return { error: failed?.error ?? null };
}

export function nextOrderIndex(list: { order_index: number }[]): number {
  return list.length === 0 ? 0 : Math.max(...list.map((x) => x.order_index)) + 1;
}

// ========================================================
// AUTH / ADMIN CHECK
// ========================================================
export async function checkIsAdmin(): Promise<{ isAdmin: boolean; error: string | null }> {
  if (!supabase) return { isAdmin: false, error: NOT_CONFIGURED };
  const { data, error } = await supabase.rpc('is_admin');
  if (error) {
    return {
      isAdmin: false,
      error: `Fungsi is_admin() gagal dipanggil (${error.message}). Pastikan supabase-admin.sql sudah dijalankan.`,
    };
  }
  return { isAdmin: data === true, error: null };
}

// ========================================================
// SEED DATA AWAL
// (menggantikan seed lama di queries.ts: fallbackProfile punya id '1'
//  yang bukan UUID valid sehingga insert profil selalu gagal)
// ========================================================
function omit<T extends object>(obj: T, keys: string[]): Record<string, unknown> {
  const copy = { ...obj } as Record<string, unknown>;
  keys.forEach((k) => delete copy[k]);
  return copy;
}

export async function seedInitialData(): Promise<{
  inserted: { profile: number; projects: number; skills: number; experiences: number };
  errors: string[];
}> {
  const inserted = { profile: 0, projects: 0, skills: 0, experiences: 0 };
  const errors: string[] = [];
  const client = supabase;
  if (!client) return { inserted, errors: [NOT_CONFIGURED] };

  const run = async (
    table: TableName,
    rows: Record<string, unknown>[],
    key: keyof typeof inserted
  ) => {
    const count = await countRows(table);
    if (count > 0) return;
    const { data, error } = await client.from(table).insert(rows).select('id');
    if (error) errors.push(`${table}: ${error.message}`);
    else inserted[key] = data?.length ?? 0;
  };

  const drop = ['id', 'created_at'];
  await run('profiles', [omit<Profile>(fallbackProfile, drop)], 'profile');
  await run('projects', fallbackProjects.map((p: Project) => omit(p, drop)), 'projects');
  await run('skills', fallbackSkills.map((s: Skill) => omit(s, ['id'])), 'skills');
  await run(
    'experiences',
    fallbackExperiences.map((e: Experience) => omit(e, ['id'])),
    'experiences'
  );

  return { inserted, errors };
}

// ========================================================
// SEED FOTO CONTOH (opsional, dari tombol di halaman Photography)
// ========================================================
export async function seedPhotos(): Promise<{ inserted: number; error: string | null }> {
  if (!supabase) return { inserted: 0, error: NOT_CONFIGURED };
  if ((await countRows('photos')) > 0) return { inserted: 0, error: null };
  const rows = fallbackPhotos.map((p, i) => ({
    title: p.title,
    category: p.category,
    url: p.url,
    camera: p.exif.camera,
    lens: p.exif.lens,
    iso: p.exif.iso,
    shutter: p.exif.shutter,
    aperture: p.exif.aperture,
    order_index: i,
  }));
  const { data, error } = await supabase.from('photos').insert(rows).select('id');
  if (error) return { inserted: 0, error: error.message };
  return { inserted: data?.length ?? 0, error: null };
}

// ========================================================
// STORAGE
// ========================================================
const BUCKET = 'portfolio';
const MAX_BYTES = 5 * 1024 * 1024; // batas bucket (lihat supabase-admin.sql)
const MAX_RAW_PHOTO_BYTES = 40 * 1024 * 1024; // foto mentah dari kamera, dikompres sebelum upload
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

/**
 * Perkecil foto di browser sebelum diunggah: sisi terpanjang maks 2400px, WebP.
 * Menghemat kuota storage, mempercepat website, dan ikut membuang metadata
 * EXIF bawaan file (termasuk lokasi GPS). Gagal -> pakai file asli.
 */
async function compressImage(file: File, maxEdge = 2400, quality = 0.85): Promise<File> {
  if (file.type === 'image/gif' || typeof createImageBitmap === 'undefined') return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, 'image/webp', quality)
    );
    if (!blob || (scale === 1 && blob.size >= file.size)) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
}

export async function uploadImage(file: File, folder: UploadFolder): Promise<Result<string>> {
  if (!supabase) return { data: null, error: NOT_CONFIGURED };
  if (!ALLOWED.includes(file.type)) {
    return { data: null, error: 'Format harus JPG, PNG, WebP, GIF, atau AVIF.' };
  }
  const isPhoto = folder === 'photography';
  if (file.size > (isPhoto ? MAX_RAW_PHOTO_BYTES : MAX_BYTES)) {
    return {
      data: null,
      error: isPhoto ? 'Ukuran foto maksimal 40 MB.' : 'Ukuran gambar maksimal 5 MB.',
    };
  }

  const toUpload = isPhoto ? await compressImage(file) : file;
  if (toUpload.size > MAX_BYTES) {
    return { data: null, error: 'Gambar masih lebih dari 5 MB setelah dikompres.' };
  }

  const ext = toUpload.type.split('/')[1].replace('jpeg', 'jpg');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, toUpload, { cacheControl: '31536000', contentType: toUpload.type });
  if (error) return { data: null, error: error.message };
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { data: data.publicUrl, error: null };
}

/** Hapus file dari bucket jika URL-nya milik bucket ini (best effort). */
export async function deleteImageByUrl(url: string | null | undefined): Promise<void> {
  if (!supabase || !url) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return;
  const path = decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
  await supabase.storage.from(BUCKET).remove([path]);
}

import { supabase, isSupabaseConfigured } from './supabase';

/** Bentuk yang dipakai komponen Photography (EXIF bersarang) */
export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  category: string;
  exif: {
    camera: string;
    lens: string;
    iso: string;
    shutter: string;
    aperture: string;
  };
}

/** Bentuk baris di tabel `photos` (datar) */
export interface PhotoRow {
  id: string;
  title: string;
  category: string;
  url: string;
  camera: string;
  lens: string;
  iso: string;
  shutter: string;
  aperture: string;
  order_index: number;
  created_at: string;
}

export function rowToItem(r: PhotoRow): PhotoItem {
  return {
    id: r.id,
    url: r.url,
    title: r.title,
    category: r.category,
    exif: {
      camera: r.camera,
      lens: r.lens,
      iso: r.iso,
      shutter: r.shutter,
      aperture: r.aperture,
    },
  };
}

/** Foto cadangan — dipakai bila Supabase belum dikonfigurasi atau tabel masih kosong */
export const fallbackPhotos: PhotoItem[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    title: 'The Golden Vow',
    category: 'Ceremony / Portrait',
    exif: { camera: 'Canon EOS R5', lens: '50mm f/1.2L', iso: 'ISO 100', shutter: '1/320s', aperture: 'f/1.4' },
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    title: 'Neon Drift',
    category: 'Street / Cyberpunk',
    exif: { camera: 'Sony A7 IV', lens: '35mm f/1.4 GM', iso: 'ISO 800', shutter: '1/125s', aperture: 'f/1.8' },
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    title: 'Geometric Solitude',
    category: 'Architecture / Minimal',
    exif: { camera: 'Fujifilm X-T5', lens: '23mm f/2.0', iso: 'ISO 160', shutter: '1/500s', aperture: 'f/5.6' },
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    title: 'Midnight Radiance',
    category: 'Editorial Studio',
    exif: { camera: 'Canon EOS R6', lens: '85mm f/1.4L', iso: 'ISO 200', shutter: '1/200s', aperture: 'f/2.0' },
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    title: 'Whispering Pines',
    category: 'Landscape / Mood',
    exif: { camera: 'Nikon Z7 II', lens: '24-70mm f/2.8', iso: 'ISO 64', shutter: '1/60s', aperture: 'f/8.0' },
  },
  {
    id: 'photo-6',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    title: 'Shinjuku Rain',
    category: 'Night City',
    exif: { camera: 'Leica Q2', lens: '28mm Summilux', iso: 'ISO 1600', shutter: '1/80s', aperture: 'f/1.7' },
  },
  {
    id: 'photo-7',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    title: 'Family Gathering',
    category: 'Documentary',
    exif: { camera: 'Canon PowerShot G7X', lens: '8.8-36.8mm', iso: 'ISO 250', shutter: '1/160s', aperture: 'f/2.8' },
  },
  {
    id: 'photo-8',
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    title: 'Analog Summer',
    category: 'Vintage 35mm',
    exif: { camera: 'Canon AE-1', lens: '50mm f/1.8 FD', iso: 'Kodak Gold 200', shutter: '1/250s', aperture: 'f/4.0' },
  },
  {
    id: 'photo-9',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    title: 'Candid Warmth',
    category: 'Portraiture',
    exif: { camera: 'Sony A7R V', lens: '50mm f/1.2 GM', iso: 'ISO 100', shutter: '1/400s', aperture: 'f/1.8' },
  },
  {
    id: 'photo-10',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    title: 'Alpine Echoes',
    category: 'Mountain Vista',
    exif: { camera: 'Hasselblad X2D', lens: '38mm f/2.5', iso: 'ISO 100', shutter: '1/125s', aperture: 'f/11' },
  },
];

/** Dipanggil dari server component (page.tsx), pola sama dengan getProjects() */
export async function getPhotos(): Promise<PhotoItem[]> {
  if (!isSupabaseConfigured() || !supabase) return fallbackPhotos;
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('order_index', { ascending: true });
    if (error || !data || data.length === 0) return fallbackPhotos;
    return (data as PhotoRow[]).map(rowToItem);
  } catch {
    return fallbackPhotos;
  }
}

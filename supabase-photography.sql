-- ========================================================
-- TABEL PHOTOS (section Photography)
-- Jalankan SETELAH supabase-admin.sql (aman dijalankan ulang).
-- ========================================================
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  camera TEXT NOT NULL DEFAULT '',
  lens TEXT NOT NULL DEFAULT '',
  iso TEXT NOT NULL DEFAULT '',
  shutter TEXT NOT NULL DEFAULT '',
  aperture TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_order ON public.photos(order_index);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read" ON public.photos;
DROP POLICY IF EXISTS "admin write" ON public.photos;

CREATE POLICY "public read" ON public.photos
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin write" ON public.photos
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

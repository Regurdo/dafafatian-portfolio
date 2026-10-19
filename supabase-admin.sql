-- ========================================================
-- ADMIN DASHBOARD — SECURITY & STORAGE MIGRATION
-- Jalankan SETELAH supabase-schema.sql (aman dijalankan ulang).
-- Supabase Dashboard -> SQL Editor -> tempel -> RUN
-- ========================================================

-- 1. TABEL ADMIN ------------------------------------------------
-- Hanya user yang terdaftar di tabel ini yang boleh mengubah data.
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- Sengaja TANPA policy: tabel ini tidak bisa dibaca lewat API publik.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. GANTI POLICY TERBUKA DENGAN POLICY AMAN ---------------------
-- Sebelumnya: "FOR ALL USING (true)" = siapa pun dengan anon key
-- bisa membaca/mengubah/menghapus SEMUA data (termasuk pesan masuk).
DROP POLICY IF EXISTS "Public access profiles"    ON profiles;
DROP POLICY IF EXISTS "Public access projects"    ON projects;
DROP POLICY IF EXISTS "Public access skills"      ON skills;
DROP POLICY IF EXISTS "Public access experiences" ON experiences;
DROP POLICY IF EXISTS "Public access messages"    ON messages;

-- Konten portfolio: publik boleh baca, hanya admin boleh tulis
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','projects','skills','experiences'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "public read" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "admin write" ON %I', t);
    EXECUTE format('CREATE POLICY "public read" ON %I FOR SELECT TO anon, authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "admin write" ON %I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;
END $$;

-- Pesan: pengunjung hanya boleh KIRIM, hanya admin yang boleh baca/ubah/hapus
DROP POLICY IF EXISTS "visitor insert" ON messages;
DROP POLICY IF EXISTS "admin all"      ON messages;

CREATE POLICY "visitor insert" ON messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    is_read = false
    AND char_length(name)    BETWEEN 1 AND 200
    AND char_length(email)   BETWEEN 3 AND 320
    AND char_length(subject) BETWEEN 1 AND 300
    AND char_length(message) BETWEEN 1 AND 5000
  );

CREATE POLICY "admin all" ON messages
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. STORAGE (upload gambar project & avatar) --------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio', 'portfolio', true, 5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "portfolio admin insert" ON storage.objects;
DROP POLICY IF EXISTS "portfolio admin update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio admin delete" ON storage.objects;

CREATE POLICY "portfolio admin insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());
CREATE POLICY "portfolio admin update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND public.is_admin());
CREATE POLICY "portfolio admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND public.is_admin());

-- 4. DAFTARKAN AKUN ADMIN KAMU ----------------------------------
-- a) Supabase Dashboard -> Authentication -> Users -> Add user
--    (isi email + password, centang "Auto Confirm User")
-- b) Ganti email di bawah, lalu jalankan:
--
-- INSERT INTO public.admins (user_id)
-- SELECT id FROM auth.users WHERE email = 'EMAIL_KAMU@contoh.com'
-- ON CONFLICT DO NOTHING;
--
-- c) Authentication -> Sign In / Providers -> matikan "Allow new users to sign up"

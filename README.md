# 🎬 Portfolio Website — Minimalist & Cinematic

Website portofolio modern dengan tema dark minimalist dan aesthetic cinematic. Dibangun menggunakan **Next.js 16**, **Tailwind CSS**, **Supabase**, dan komponen interaktif dari **React Bits**.

---

## ✨ Fitur & Interaktivitas

### 1. Komponen React Bits yang Diimplementasikan
- **SplitText** (`src/components/reactbits/SplitText.tsx`): Animasi staggered huruf di headline Hero section menggunakan GSAP.
- **BlurText** (`src/components/reactbits/BlurText.tsx`): Animasi transisi blur-to-focus teks bio Hero saat pertama kali masuk viewport.
- **DecryptedText** (`src/components/reactbits/DecryptedText.tsx`): Efek dekripsi teks acak ala cyber/matrix saat cursor hover pada menu navigasi.
- **ScrollVelocity** (`src/components/reactbits/ScrollVelocity.tsx`): Marquee teks parallax infinite yang bereaksi dinamis terhadap kecepatan scroll user.
- **SpotlightCard** (`src/components/reactbits/SpotlightCard.tsx`): Kartu proyek dengan efek radial spotlight glow yang mengikuti pergerakan kursor secara real-time.
- **AnimatedContent** (`src/components/reactbits/AnimatedContent.tsx`): Transisi reveal bertahap yang dipicu saat elemen di-scroll ke viewport.
- **Magnet** (`src/components/reactbits/Magnet.tsx`): Efek magnetik interaktif pada tombol navigasi dan tombol CTA yang tertarik ke arah cursor pointer.
- **ClickSpark** (`src/components/reactbits/ClickSpark.tsx`): Partikel percikan dinamis yang meledak di koordinat klik tombol.

### 2. Estetika Sinematik
- **Grain Overlay**: Tekstur film grain halus di seluruh halaman.
- **Vignette Layer**: Efek gradien bayangan di sudut layar untuk depth kamera bioskop.
- **Dark Minimalist Palette**: Hitam pekat `#0a0a0a`, surface `#141414`, aksen border halus `white/[0.08]`.

---

## 🗄️ Menghubungkan Supabase Database

Website ini sudah dilengkapi sistem **dual-mode**:
1. **Fallback Mode (Default)**: Jika Supabase belum diisi, website otomatis memakai data fallback lokal yang lengkap di `src/lib/data.ts`.
2. **Supabase Mode**: Begitu Anda memasukkan URL & Anon Key di `.env.local`, website langsung mengambil data dinamis dari Supabase.

### Langkah Setup Supabase:
1. Buka [Supabase Dashboard](https://supabase.com) dan buat project baru.
2. Buka menu **SQL Editor**, lalu copy-paste seluruh isi file [`supabase-schema.sql`](file:///c:/Users/Dafa/Documents/Coding/Portofolio%20Website/portfolio/supabase-schema.sql) dan klik **Run**.
3. Buka **Project Settings > API**, salin `Project URL` dan `anon/public key`.
4. Buka file [`.env.local`](file:///c:/Users/Dafa/Documents/Coding/Portofolio%20Website/portfolio/.env.local) dan isi:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. Data pesan dari form kontak di halaman web otomatis tersimpan ke tabel `messages` di Supabase!

---

## 🚀 Menjalankan Project

```bash
# Masuk ke folder project
cd portfolio

# Jalankan development server
npm run dev

# Jalankan production build
npm run build
npm start
```

Server lokal berjalan di: [http://localhost:3001](http://localhost:3001)

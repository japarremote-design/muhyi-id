# Task — muhyi.id

Status: ✅ selesai di paket ini · ⬜ dikerjakan om Muhyi (butuh akun/kunci) · 🔜 tahap berikutnya

## Tahap 0 — Fondasi
- ✅ Inisialisasi Next.js 14 App Router + Tailwind
- ✅ Sistem token warna burgundi–gold, tipografi Fraunces + Plus Jakarta Sans
- ✅ Motif *gerbang*, *sulur*, tekstur *sarang madu*
- ✅ Logo monogram, favicon, ikon PWA 192/512/maskable, apple-touch-icon
- ✅ Gambar OpenGraph 1200×630

## Tahap 1 — Kerangka situs
- ✅ Layout akar + metadata OpenGraph & Twitter + JSON-LD `Person`
- ✅ Header sticky (desktop) dengan tombol Kirim Aspirasi
- ✅ Bar menu bawah untuk HP: 5 tombol utama + lembar "Lainnya…"
- ✅ Tombol melayang WhatsApp (berkedip) & Aspirasi (buku + ballpen)
- ✅ Footer lengkap dengan medsos
- ✅ Halaman 404 dan halaman luring

## Tahap 2 — Halaman
- ✅ Beranda · Profil · Gagasan · Pengabdian · Aspirasi · Event · Kontak
- ✅ Daftar kabar `/berita` dan detail `/berita/[slug]` dengan OG per artikel
- ✅ Data contoh sebagai cadangan agar situs tetap tampil sebelum Firestore tersambung

## Tahap 3 — Mesin konten
- ✅ `POST /api/scrape` — tarik judul, ringkasan, gambar, isi, sumber, tanggal dari tautan luar
- ✅ `POST /api/berita` — simpan ke Firestore, terlindungi token admin
- ✅ `DELETE /api/berita` — hapus konten
- ✅ `POST /api/upload` — unggah gambar ke Cloudinary
- ✅ `POST /api/aspirasi` — simpan aspirasi + honeypot + pembatas laju
- ✅ Panel `/admin`: login Google, formulir konten 5 koleksi, tombol Tarik data, kotak aspirasi masuk

## Tahap 4 — PWA & SEO
- ✅ `manifest.json` + pintasan aplikasi (Aspirasi, Kabar)
- ✅ Service worker (cangkang aplikasi, fallback luring)
- ✅ Tawaran "Pasang di HP" yang bisa ditutup
- ✅ `sitemap.xml`, `robots.txt`

## Tahap 5 — Yang perlu om siapkan ⬜
1. ⬜ Buat proyek Firebase → aktifkan **Firestore** dan **Authentication (Google)**
2. ⬜ Buat *service account* → salin `project_id`, `client_email`, `private_key`
3. ⬜ Daftar akun Cloudinary → salin `cloud_name`, `api_key`, `api_secret`
4. ⬜ Salin `.env.example` → isi `.env.local`; isi juga di Vercel → Settings → Environment Variables
5. ⬜ Ganti `email-admin@gmail.com` di `.env` **dan** di `firestore.rules` dengan email Gmail om
6. ⬜ Terapkan `firestore.rules` di Firebase Console → Firestore → Rules
7. ⬜ Ganti `public/foto-muhyi.jpg` dengan foto asli (potret, minimal 800×1000)
8. ⬜ Push ke GitHub → hubungkan repo di Vercel → deploy
9. ⬜ Hapus isi `src/lib/contoh.js` setelah konten asli masuk
10. ⬜ Saat domain siap: tambah `muhyi.id` di Vercel → ubah `NEXT_PUBLIC_SITE_URL`

## Tahap 6 — Editor & tindak lanjut (paket kedua)
- ✅ Editor teks kaya tanpa pustaka tambahan: tebal, miring, subjudul, kutipan, daftar, tautan, sisip gambar, tombol *Lihat HTML*
- ✅ Tempelan dari portal luar otomatis jadi teks polos (gaya asing tidak ikut terbawa)
- ✅ Sisip gambar di tengah tulisan, langsung naik ke Cloudinary
- ✅ Alur tindak lanjut aspirasi: **Baru → Dibaca → Diproses → Selesai → Arsip**
- ✅ Kartu aspirasi otomatis jadi *Dibaca* saat dibuka pengelola
- ✅ Catatan tindak lanjut internal per aspirasi
- ✅ Tombol *Balas lewat WhatsApp* dengan nomor pelapor dinormalkan otomatis (08… → 62…)
- ✅ Saringan per status + penghitung + pencarian nama/desa/isi
- ✅ Hapus aspirasi spam (dengan konfirmasi)
- ✅ `PATCH` & `DELETE /api/aspirasi`, keduanya butuh token pengelola
- ✅ Kredit *Powered by Qfaz Digital* di footer

## Tahap 7 — Berikutnya 🔜
- 🔜 Galeri foto kegiatan
- 🔜 Notifikasi WhatsApp otomatis saat aspirasi baru masuk
- 🔜 Ringkasan otomatis artikel hasil tarik data (agar tidak menyalin utuh)
- 🔜 Statistik aspirasi per desa dan per bidang
- 🔜 Ekspor aspirasi ke Excel/CSV

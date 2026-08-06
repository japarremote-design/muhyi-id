# PRD — muhyi.id

**Versi** 1.0 · **Domain sementara** muhyi-id.vercel.app · **Domain final** muhyi.id

---

## 1. Ringkasan

Situs pribadi Muhyi — Ketua Dewan Kesehatan Rakyat Bangkalan — yang berfungsi sebagai
etalase rekam jejak sekaligus kanal aspirasi warga. Situs harus terasa hidup: konten bisa
ditambah kapan saja tanpa menyentuh kode, dan berita dari portal luar bisa ditarik isinya
hanya dengan menempel tautan.

## 2. Masalah yang diselesaikan

| Masalah | Dampak sekarang | Solusi di situs |
|---|---|---|
| Liputan media tersebar, hilang di grup WA | Rekam jejak tidak terkumpul | Tarik data dari tautan → arsip permanen + tag sumber |
| Aspirasi warga masuk lewat chat, mudah tenggelam | Tidak terlacak | Formulir aspirasi tersimpan di Firestore |
| Profil hanya ada di bio medsos, terbatas | Publik tidak kenal utuh | Halaman Profil, Gagasan, Pengabdian yang bisa diperbarui |
| Share tautan di WA tampil polos | Kurang meyakinkan | OpenGraph: logo + judul + deskripsi otomatis |

## 3. Pengguna

1. **Warga Bangkalan** — mayoritas Android kelas menengah-bawah, jaringan tidak stabil, buka lewat tautan WhatsApp. *Kebutuhan:* cepat, hemat kuota, tombol besar di jangkauan ibu jari.
2. **Pengelola (Muhyi / tim)** — memposting dari HP. *Kebutuhan:* satu formulir, sekali tempel tautan, langsung terbit.
3. **Wartawan / mitra** — mencari profil dan kontak resmi. *Kebutuhan:* halaman profil rapi dan kontak jelas.

## 4. Prinsip produk

- **Cepat di HP murah.** Tidak ada animasi berat, gambar dioptimalkan Cloudinary.
- **Jujur soal sumber.** Berita kutipan selalu diberi tag dan tautan ke portal asli — bukan diklaim sendiri.
- **Sekali sentuh.** Menambah konten tidak boleh lebih dari satu formulir.
- **Tidak buntu.** Setiap kegagalan menawarkan jalan lain (biasanya WhatsApp).

## 5. Fitur

### 5.1 Wajib (v1 — sudah dibangun)

| Kode | Fitur | Kriteria diterima |
|---|---|---|
| F-01 | Beranda dinamis | Hero, ticker peran, kabar terbaru, gagasan, pengabdian, agenda, ajakan aspirasi |
| F-02 | Tarik data tautan luar | Tempel URL → judul, ringkasan, gambar, isi, nama sumber, tanggal terisi otomatis |
| F-03 | Tag sumber luar | Kartu & halaman berita menampilkan "Baca di <domain>", membuka tab baru, `rel="nofollow noopener"` |
| F-04 | Posting berita sendiri | Judul, ringkasan, isi, gambar, kategori, tanggal, status terbit |
| F-05 | Input pengalaman pribadi | Koleksi `pengalaman` dikelompokkan menurut jenis di halaman Profil |
| F-06 | Formulir aspirasi | Nama + isi wajib, honeypot anti-spam, pembatas 20 detik/IP, tersimpan di Firestore |
| F-07 | OpenGraph | Gambar 1200×630 default + OG per artikel (judul, ringkasan, gambar artikel) |
| F-08 | PWA | `manifest.json`, service worker, tawaran "Pasang di HP", halaman luring |
| F-09 | Menu bawah di HP | 5 tombol utama + "Lainnya…" untuk sisanya |
| F-10 | Tombol melayang | WhatsApp berkedip hijau + Aspirasi emas berikon buku & ballpen |
| F-11 | Panel pengelola | Login Google, daftar putih email, tulis konten, unggah gambar, baca aspirasi |
| F-12 | SEO | `sitemap.xml`, `robots.txt`, JSON-LD `Person` |
| F-13 | Editor teks kaya | Toolbar format, sisip gambar, tempelan jadi teks polos, mode HTML |
| F-14 | Tindak lanjut aspirasi | Lima status, catatan internal, balas WhatsApp, saring & cari, hapus spam |
| F-15 | Kredit pengembang | *Powered by Qfaz Digital* di footer, tertaut ke qfazdigital.my.id |

### 5.2 Berikutnya (v2)

- Galeri foto kegiatan
- Notifikasi WhatsApp otomatis saat aspirasi baru masuk
- Statistik sederhana (jumlah aspirasi per desa)

## 6. Identitas visual

| Peran | Nilai |
|---|---|
| Burgundi inti | `#5C1428` |
| Burgundi dalam | `#2E0A17` |
| Emas | `#C8A02E` |
| Emas muda | `#E7CE8A` |
| Krem (latar) | `#FAF6EF` |
| Tinta | `#1A1215` |

**Tipografi.** Fraunces untuk judul — serif dengan karakter, dipakai hemat. Plus Jakarta Sans
untuk badan teks (huruf rancangan Indonesia, terbaca baik di layar kecil).

**Tanda tangan visual.** *Gerbang* — lengkung khas gapura Madura dipakai sebagai bingkai foto
utama, sudut kartu, dan blok ajakan aspirasi. Ditemani garis *sulur* emas sebagai pemisah dan
tekstur *sarang madu* halus (mengangguk ke Battar Madu) pada blok gelap.

## 7. Arsitektur

```
Pengunjung ──> Vercel (Next.js App Router)
                 ├─ Halaman publik  ──> Firestore (Admin SDK, ISR 60 detik)
                 ├─ /api/scrape     ──> portal berita luar (cheerio)
                 ├─ /api/aspirasi   ──> Firestore koleksi `aspirasi`
                 ├─ /api/berita     ──> Firestore (butuh token admin)
                 └─ /api/upload     ──> Cloudinary
Pengelola ──> /admin (Firebase Auth Google) ──> API di atas
Kode ──> GitHub ──> auto-deploy Vercel
```

## 8. Model data Firestore

**berita** · `judul, slug, ringkasan, isi, gambar, kategori, sumberJenis(sendiri|luar), sumberUrl, sumberNama, tanggal, terbit, penulis, diperbarui`
**gagasan** · `judul, slug, ringkasan, isi, bidang, tanggal`
**pengabdian** · `judul, peran, periode, ringkasan, gambar, tanggal`
**pengalaman** · `judul, organisasi, periode, jenis, ringkasan, tanggal`
**event** · `judul, slug, ringkasan, lokasi, tanggal, terbit`
**aspirasi** · `nama, kontak, wilayah, kategori, pesan, status, catatan, penanganMasuk, tanggal, diperbarui`
Status berjalan: `baru → dibaca → diproses → selesai → arsip`. Hanya pengelola yang bisa mengubah, lewat `PATCH /api/aspirasi`.

Indeks komposit yang perlu dibuat: `berita(terbit ASC, tanggal DESC)` dan `event(terbit ASC, tanggal DESC)`.

## 9. Keamanan

- Menulis konten hanya lewat API server dengan token Firebase + daftar putih `ADMIN_EMAILS`.
- Koleksi `aspirasi` tidak bisa ditulis dari klien; hanya lewat Admin SDK.
- Kredensial hanya di environment Vercel, tidak pernah masuk repositori.
- `/admin` dan `/api/` ditolak di `robots.txt`.

## 10. Ukuran keberhasilan

| Ukuran | Target 3 bulan |
|---|---|
| Aspirasi masuk | ≥ 30 per bulan |
| Kabar terbit | ≥ 8 per bulan |
| Pemasangan PWA | ≥ 100 perangkat |
| Skor Lighthouse (mobile) | ≥ 90 Performance, 100 Accessibility |

## 11. Batasan yang diketahui

- Sebagian portal berita memblokir pengambilan dari server (Cloudflare). Ditangani dengan pesan galat yang jelas dan opsi salin manual.
- Menyalin isi artikel utuh berpotensi masalah hak cipta. **Anjuran:** simpan ringkasan + beberapa paragraf saja, dan biarkan tombol "Baca di sumber" jadi jalur utama.

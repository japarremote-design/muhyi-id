# muhyi.id

Situs pribadi **Muhyi** — Ketua Dewan Kesehatan Rakyat Bangkalan.
Next.js 14 (App Router) · Firestore · Cloudinary · Vercel · PWA.

Dokumen: [PRD](docs/PRD.md) · [Task](docs/TASK.md)

---

## Jalankan di komputer

```bash
npm install
cp .env.example .env.local     # isi kuncinya
npm run dev                    # buka http://localhost:3000
```

Situs tetap tampil walau `.env.local` belum diisi — halaman memakai data contoh
di `src/lib/contoh.js`. Hapus isinya setelah konten asli masuk ke Firestore.

## Siapkan Firebase

1. Buat proyek di console.firebase.google.com
2. **Build → Firestore Database → Create database** (mode production)
3. **Build → Authentication → Sign-in method → Google → Enable**
4. **⚙ Project settings → Service accounts → Generate new private key**
   Ambil `project_id`, `client_email`, `private_key` → masukkan ke `.env.local`
5. **Firestore → Rules** → tempel isi `firestore.rules` apa adanya → **Publish**
6. `ADMIN_EMAILS` sudah berisi `muhyibcp@gmail.com` — isikan nilai yang sama di Vercel

> Email pengelola (`muhyibcp@gmail.com`) tertulis di **dua tempat** dan keduanya harus sama:
> `ADMIN_EMAILS` di environment (dipakai server saat menyimpan konten) dan daftar di
> `firestore.rules` (dipakai Firestore saat membaca aspirasi). Kalau nanti mau menambah
> pengelola lain, tambahkan di dua tempat itu juga — `ADMIN_EMAILS` dipisah koma,
> `firestore.rules` dipisah koma di dalam kurung siku.

Indeks yang perlu dibuat (Firestore akan menawarkan tautannya saat pertama error):
`berita: terbit ASC + tanggal DESC` dan `event: terbit ASC + tanggal DESC`.

## Siapkan Cloudinary

Daftar di cloudinary.com → Dashboard → salin `Cloud name`, `API Key`, `API Secret`
ke `.env.local`. Gambar diunggah lewat `/api/upload` dan otomatis dikecilkan ke lebar 1600px.

## Deploy ke Vercel

```bash
git init && git add . && git commit -m "muhyi.id v1"
git remote add origin https://github.com/USERNAME/muhyi-id.git
git push -u origin main
```

Lalu di vercel.com → **Add New → Project → Import** repo tersebut →
salin semua isi `.env.local` ke **Settings → Environment Variables** → **Deploy**.

Saat domain `muhyi.id` sudah aktif: Vercel → Settings → Domains → tambahkan,
lalu ubah `NEXT_PUBLIC_SITE_URL` menjadi `https://muhyi.id` dan deploy ulang.

## Cara memakai

**Menerbitkan berita dari portal luar**
`/admin` → masuk dengan Google → tempel tautan artikel → **Tarik data** →
periksa hasilnya → **Simpan konten**. Kartu berita otomatis memakai tag
"Dari media" dan tombol *Baca di [domain]* yang membuka portal aslinya.

> Saran: sunting isinya jadi ringkasan beberapa paragraf saja, jangan salin utuh.
> Biarkan tombol sumber jadi jalur baca utama — lebih aman soal hak cipta.

**Menulis kabar sendiri** — sama, tanpa mengisi tautan sumber.

**Menambah pengalaman pribadi** — pilih jenis konten *Pengalaman pribadi*.
Isi *Kategori* dengan jenisnya (Organisasi / Usaha / Pendidikan) supaya
dikelompokkan otomatis di halaman Profil.

**Membaca aspirasi masuk** — `/admin` → tab **Aspirasi masuk**.

## Struktur berkas

```
src/
├── app/
│   ├── layout.jsx          metadata OG, font, kerangka
│   ├── page.jsx            beranda
│   ├── profil|gagasan|pengabdian|aspirasi|event|kontak/
│   ├── berita/             daftar + [slug] detail
│   ├── admin/              panel pengelola
│   └── api/                scrape · berita · aspirasi · upload
├── components/             Hero, BottomNav, FloatingActions, KartuBerita, dst.
└── lib/                    site.js (menu & kontak) · data.js · firebase · cloudinary
public/                     ikon PWA, favicon, og.png, foto-muhyi.jpg
```

Menu diubah di satu tempat: `src/lib/site.js`.
Ubah `utama: true/false` untuk menentukan tombol mana yang tampil di bar bawah HP
dan mana yang masuk **Lainnya…**

## Editor tulisan

Kolom **Isi tulisan** di `/admin` punya toolbar: tebal, miring, subjudul (H2), kutipan,
daftar titik/nomor, tautan, dan sisip gambar (langsung naik ke Cloudinary).
Tombol **Lihat HTML** untuk menyunting kodenya langsung.

Teks yang ditempel dari portal berita luar otomatis dijadikan **teks polos** — warna,
huruf, dan iklan tersembunyi dari situs asal tidak ikut terbawa.

## Alur tindak lanjut aspirasi

`/admin` → tab **Aspirasi masuk**. Setiap aspirasi berjalan lewat lima status:

**Baru → Dibaca → Diproses → Selesai → Arsip**

Kartu otomatis berpindah ke *Dibaca* begitu dibuka. Di dalamnya ada catatan tindak
lanjut internal (tidak tampil ke publik) dan tombol **Balas lewat WhatsApp** yang
memakai nomor pelapor — format `08…` otomatis diubah ke `62…`.

Ada saringan per status berikut penghitungnya, kotak pencarian nama/desa/isi, dan
tombol hapus untuk kiriman spam.

---

Dikembangkan oleh [Qfaz Digital](https://qfazdigital.my.id/).

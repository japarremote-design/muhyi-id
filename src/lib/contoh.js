/**
 * Data contoh. Dipakai hanya saat Firestore belum tersambung,
 * supaya tampilan bisa langsung dilihat dan dinilai.
 * Hapus isinya setelah konten asli masuk ke Firestore.
 */
export const contoh = {
  berita: [
    {
      id: 'c1',
      slug: 'posyandu-keliling-desa-pesisir',
      judul: 'Posyandu keliling menyapa desa pesisir Bangkalan',
      ringkasan:
        'Layanan timbang balita dan cek tensi gratis dibawa langsung ke balai desa, menjangkau warga yang selama ini jauh dari puskesmas.',
      isi: '<p>Dewan Kesehatan Rakyat Bangkalan menjalankan posyandu keliling ke desa-desa pesisir. Kegiatan ini menyasar ibu hamil, balita, dan lansia yang kesulitan menjangkau fasilitas kesehatan.</p><p>Selain pemeriksaan, warga mendapat penyuluhan gizi dan sanitasi.</p>',
      gambar: '',
      sumberJenis: 'sendiri',
      tanggal: '2026-07-18T02:00:00.000Z',
      kategori: 'Kesehatan',
      terbit: true,
    },
    {
      id: 'c2',
      slug: 'liputan-madu-madura-tembus-pasar-luar-pulau',
      judul: 'Madu Madura tembus pasar luar pulau',
      ringkasan:
        'Produk madu premium asal Bangkalan mulai rutin dikirim ke luar Jawa Timur setelah pembenahan kemasan dan izin edar.',
      isi: '<p>Ringkasan liputan media mengenai berkembangnya usaha madu asal Bangkalan.</p>',
      gambar: '',
      sumberJenis: 'luar',
      sumberUrl: 'https://contoh-portal-berita.co.id/madu-madura',
      sumberNama: 'contoh-portal-berita.co.id',
      tanggal: '2026-06-30T02:00:00.000Z',
      kategori: 'Ekonomi',
      terbit: true,
    },
  ],
  gagasan: [
    {
      id: 'g1',
      slug: 'satu-desa-satu-kader-kesehatan',
      judul: 'Satu desa, satu kader kesehatan terlatih',
      ringkasan: 'Kader desa dilatih deteksi dini agar keluhan warga tertangani sebelum menjadi berat.',
      isi: '<p>Kader kesehatan desa adalah garis depan. Pelatihan rutin dan insentif yang jelas membuat mereka bertahan.</p>',
      bidang: 'Kesehatan',
      tanggal: '2026-05-02T02:00:00.000Z',
    },
    {
      id: 'g2',
      slug: 'madura-berdaya-lewat-produk-desa',
      judul: 'Madura berdaya lewat produk desa',
      ringkasan: 'Pendampingan izin edar, kemasan, dan pasar daring untuk UMKM kampung.',
      isi: '<p>Produk desa sering kalah bukan karena mutu, tapi karena kemasan dan izin.</p>',
      bidang: 'Ekonomi',
      tanggal: '2026-04-11T02:00:00.000Z',
    },
  ],
  pengabdian: [
    {
      id: 'p1',
      judul: 'BangkalanBerbagi',
      peran: 'Penggerak',
      periode: '2019 — sekarang',
      ringkasan: 'Gerakan berbagi sembako, santunan, dan bantuan kesehatan bagi warga Bangkalan.',
      tanggal: '2019-01-01T00:00:00.000Z',
    },
    {
      id: 'p2',
      judul: 'Dewan Kesehatan Rakyat Bangkalan',
      peran: 'Ketua',
      periode: 'sekarang',
      ringkasan: 'Mengawal hak warga atas layanan kesehatan yang layak dan terjangkau.',
      tanggal: '2022-01-01T00:00:00.000Z',
    },
  ],
  pengalaman: [
    { id: 'e1', judul: 'Ketua Dewan Kesehatan Rakyat Bangkalan', organisasi: 'DKR Bangkalan', periode: 'sekarang', jenis: 'Organisasi', tanggal: '2022-01-01T00:00:00.000Z' },
    { id: 'e2', judul: 'Pendiri Battar Madu Premium', organisasi: 'Battar Madu', periode: '—', jenis: 'Usaha', tanggal: '2018-01-01T00:00:00.000Z' },
    { id: 'e3', judul: 'Universitas Terbuka', organisasi: 'Akademik', periode: '—', jenis: 'Pendidikan', tanggal: '2015-01-01T00:00:00.000Z' },
  ],
  event: [
    {
      id: 'v1',
      slug: 'temu-warga-kecamatan-kota',
      judul: 'Temu warga Kecamatan Kota',
      ringkasan: 'Dengar pendapat soal layanan puskesmas dan BPJS.',
      lokasi: 'Balai Desa, Bangkalan',
      tanggal: '2026-09-14T02:00:00.000Z',
      terbit: true,
    },
  ],
};

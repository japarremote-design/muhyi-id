export const site = {
  nama: 'muhyi.id',
  namaLengkap: 'Muhyi',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://muhyi-id.vercel.app',
  kota: 'Bangkalan, Madura',
  slogan: 'Aku Apa Adanya Saja',
  pembuat: { nama: 'Qfaz Digital', url: 'https://qfazdigital.my.id/' },

  /**
   * Daftar ini HANYA untuk menampilkan pesan yang ramah di panel pengelola.
   * Kunci yang sesungguhnya tetap di firestore.rules — itu yang dijalankan
   * server Google dan tidak bisa diakali dari browser.
   * Kalau menambah pengelola, ubah di DUA tempat: di sini dan di firestore.rules.
   */
  pengelola: ['qfazdigital@gmail.com', 'muhyibcp@gmail.com'],
  deskripsi:
    'Ketua Dewan Kesehatan Rakyat Bangkalan. Relawan sosial, motivator, akademisi, praktisi, dan entrepreneur asal Bangkalan, Madura. Kirim aspirasi Anda langsung dari halaman ini.',
  wa: '62817799996', // 0817-799-996 dalam format internasional
  waTampil: '0817-799-996',
  waPesan: 'Assalamualaikum Pak Muhyi, saya ingin menyampaikan sesuatu.',
  peran: [
    'Relawan Sosial',
    'Politisi',
    'Akademisi',
    'Praktisi',
    'Entrepreneur',
    'Konten Kreator',
    'Motivator',
    'Rakyat Biasa',
  ],
  jabatan: 'Ketua Dewan Kesehatan Rakyat Bangkalan',
  tautan: [
    { nama: 'BangkalanBerbagi', ket: 'Gerakan berbagi warga Bangkalan' },
    { nama: 'Battar Madu Premium', ket: 'Usaha madu asli Madura' },
    { nama: 'Universitas Terbuka', ket: 'Jalur akademik' },
  ],
  medsos: [
    { nama: 'Facebook', url: 'https://www.facebook.com/muhyibcp2', handle: 'muhyibcp2' },
    { nama: 'Instagram', url: 'https://www.instagram.com/muhyibcp1', handle: 'muhyibcp1' },
    { nama: 'TikTok', url: 'https://www.tiktok.com/@muhyibcp2', handle: '@muhyibcp2' },
    { nama: 'Threads', url: 'https://www.threads.com/@muhyibcp1', handle: '@muhyibcp1' },
  ],
};

// Urutan menu. `utama` = tampil di bar bawah HP, sisanya masuk "Lainnya".
export const menu = [
  { label: 'Beranda', href: '/', utama: true, ikon: 'home' },
  { label: 'Profil', href: '/profil', utama: true, ikon: 'user' },
  { label: 'Gagasan', href: '/gagasan', utama: true, ikon: 'bulb' },
  { label: 'Pengabdian', href: '/pengabdian', utama: true, ikon: 'hands' },
  { label: 'Aspirasi', href: '/aspirasi', utama: false, ikon: 'chat' },
  { label: 'Galeri', href: '/galeri', utama: false, ikon: 'foto' },
  { label: 'Event', href: '/event', utama: false, ikon: 'calendar' },
  { label: 'Kontak', href: '/kontak', utama: false, ikon: 'phone' },
];

export const waLink = (pesan) =>
  `https://wa.me/${site.wa}?text=${encodeURIComponent(pesan || site.waPesan)}`;

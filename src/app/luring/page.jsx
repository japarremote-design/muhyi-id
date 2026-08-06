import Link from 'next/link';
import Logo from '@/components/Logo';

export const metadata = { title: 'Sedang luring' };

export default function Luring() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <Logo className="mx-auto h-16 w-16" />
      <h1 className="mt-6 font-display text-2xl font-semibold text-burgundy-950">Tidak ada koneksi</h1>
      <p className="mt-2 text-ink/70">
        Halaman ini butuh internet. Sambungkan kembali, lalu muat ulang.
      </p>
      <Link href="/" className="tombol-utama mt-6">Kembali ke beranda</Link>
    </div>
  );
}

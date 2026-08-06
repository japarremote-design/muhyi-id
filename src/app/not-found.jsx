import Link from 'next/link';
import Logo from '@/components/Logo';

export default function TidakDitemukan() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <Logo className="mx-auto h-16 w-16" />
      <p className="label mt-6 text-burgundy-600">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-burgundy-950">Halaman tidak ada</h1>
      <p className="mt-2 text-ink/70">Tautannya mungkin salah ketik, atau isinya sudah dipindah.</p>
      <Link href="/" className="tombol-utama mt-6">Kembali ke beranda</Link>
    </div>
  );
}

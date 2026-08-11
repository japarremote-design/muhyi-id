'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { waLink } from '@/lib/site';
import { IkonWA, IkonAspirasi } from './Ikon';

export default function FloatingActions() {
  const path = usePathname();
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTampil(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (path.startsWith('/admin')) return null;

  return (
    <div
      className={`fixed right-4 z-40 flex flex-col items-end gap-3 transition-all duration-300 ${
        tampil ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{
        bottom:
          'calc(var(--bar-bawah) + env(safe-area-inset-bottom) + 0.9rem + var(--tawaran-pasang))',
      }}
    >
      {/* Aspirasi — buku + ballpen */}
      <Link
        href="/aspirasi"
        className="group flex items-center gap-2 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-3.5 text-burgundy-950 shadow-gold animate-kedipGold sm:pr-5"
        aria-label="Kirim aspirasi"
      >
        <IkonAspirasi className="h-7 w-7" />
        <span className="hidden text-sm font-bold sm:inline">Aspirasi</span>
      </Link>

      {/* WhatsApp — berkedip */}
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg animate-kedip sm:pr-5"
        aria-label="Hubungi lewat WhatsApp"
      >
        <IkonWA className="h-7 w-7" />
        <span className="hidden text-sm font-bold sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menu, site, waLink } from '@/lib/site';
import Ikon from './Ikon';

export default function BottomNav() {
  const path = usePathname();
  const [buka, setBuka] = useState(false);
  const utama = menu.filter((m) => m.utama);
  const lainnya = menu.filter((m) => !m.utama);

  useEffect(() => setBuka(false), [path]);
  useEffect(() => {
    document.body.style.overflow = buka ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [buka]);

  const adaDiLainnya = lainnya.some((m) => m.href === path);

  return (
    <>
      {buka && (
        <div
          className="fixed inset-0 z-40 bg-burgundy-950/55 backdrop-blur-sm md:hidden"
          onClick={() => setBuka(false)}
          aria-hidden="true"
        />
      )}

      {/* Lembar "Lainnya" */}
      <div
        id="menu-lainnya"
        className={`fixed inset-x-0 z-50 md:hidden ${buka ? '' : 'pointer-events-none'}`}
        style={{ bottom: 'calc(var(--bar-bawah) + env(safe-area-inset-bottom))' }}
      >
        <div
          className={`mx-3 overflow-hidden rounded-2xl border border-gold-500/30 bg-burgundy-900 shadow-arch transition-all duration-300 ${
            buka ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between px-4 pb-2 pt-3">
            <span className="label text-gold-400">Menu lainnya</span>
            <button
              onClick={() => setBuka(false)}
              className="rounded-full p-1.5 text-cream/70 hover:bg-white/10"
              aria-label="Tutup menu lainnya"
            >
              <Ikon nama="tutup" className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 p-3 pt-1">
            {lainnya.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition ${
                  path === m.href ? 'bg-gold-500/15 text-gold-300' : 'text-cream/85 active:bg-white/10'
                }`}
              >
                <Ikon nama={m.ikon} className="h-5 w-5" />
                <span className="text-[.7rem] font-semibold">{m.label}</span>
              </Link>
            ))}
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center text-cream/85 active:bg-white/10"
            >
              <Ikon nama="phone" className="h-5 w-5" />
              <span className="text-[.7rem] font-semibold">{site.waTampil}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bar menu bawah — jangkauan ibu jari */}
      <nav
        className="bar-bawah-hp fixed inset-x-0 bottom-0 z-50 border-t border-gold-500/30 bg-burgundy-950 shadow-[0_-8px_24px_-12px_rgba(46,10,23,.55)] backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Menu bawah"
      >
        <ul className="grid grid-cols-5" style={{ height: 'var(--bar-bawah)' }}>
          {utama.map((m) => {
            const aktif = path === m.href;
            return (
              <li key={m.href}>
                <Link
                  href={m.href}
                  aria-current={aktif ? 'page' : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-1 transition ${
                    aktif ? 'text-gold-400' : 'text-cream/65'
                  }`}
                >
                  <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${aktif ? 'bg-gold-500/15' : ''}`}>
                    <Ikon nama={m.ikon} className="h-5 w-5" />
                  </span>
                  <span className="text-[.62rem] font-semibold tracking-wide">{m.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setBuka((v) => !v)}
              aria-expanded={buka}
              aria-controls="menu-lainnya"
              className={`flex h-full w-full flex-col items-center justify-center gap-1 transition ${
                buka || adaDiLainnya ? 'text-gold-400' : 'text-cream/65'
              }`}
            >
              <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${buka || adaDiLainnya ? 'bg-gold-500/15' : ''}`}>
                <Ikon nama="titik" className="h-5 w-5" />
              </span>
              <span className="text-[.62rem] font-semibold tracking-wide">Lainnya</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

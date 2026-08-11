'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menu, site, waLink } from '@/lib/site';
import Logo from './Logo';
import Ikon from './Ikon';

export default function SiteHeader() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/25 bg-burgundy-950/95 backdrop-blur supports-[backdrop-filter]:bg-burgundy-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Beranda muhyi.id">
          <Logo className="h-9 w-9 shrink-0" />
          <span className="font-display text-xl font-semibold tracking-tight text-cream">
            muhyi<span className="text-gold-400">.id</span>
          </span>
        </Link>

        <nav className="menu-atas-hp hidden items-center gap-1 overflow-x-auto md:flex" aria-label="Menu utama">
          {menu.slice(1).map((m) => {
            const aktif = path === m.href;
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={aktif ? 'page' : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold uppercase tracking-wider transition ${
                  aktif ? 'bg-gold-500/15 text-gold-300' : 'text-cream/75 hover:bg-white/5 hover:text-cream'
                }`}
              >
                {m.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-gold-500/40 px-3.5 py-2 text-sm font-semibold text-gold-300 transition hover:bg-gold-500/10 lg:inline-flex"
          >
            {site.waTampil}
          </a>
          <Link
            href="/aspirasi"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 px-4 py-2 text-sm font-bold text-burgundy-950 transition hover:brightness-110"
          >
            Kirim Aspirasi
            <Ikon nama="panah" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

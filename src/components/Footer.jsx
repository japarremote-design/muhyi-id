import Link from 'next/link';
import { menu, site, waLink } from '@/lib/site';
import Logo from './Logo';
import Ikon from './Ikon';

export default function Footer() {
  return (
    <footer className="madu border-t border-gold-500/25 bg-burgundy-950 text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="h-10 w-10" />
            <span className="font-display text-xl font-semibold text-cream">
              muhyi<span className="text-gold-400">.id</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.jabatan}</p>
          <p className="mt-3 font-display text-lg italic text-gold-300">.. {site.slogan} ..</p>
        </div>

        <div>
          <p className="label text-gold-400">Halaman</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {menu.map((m) => (
              <li key={m.href}>
                <Link href={m.href} className="transition hover:text-gold-300">
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label text-gold-400">Terhubung</p>
          <ul className="mt-4 space-y-2 text-sm">
            {site.medsos.map((m) => (
              <li key={m.url}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-gold-300"
                >
                  {m.nama} <span className="text-cream/50">{m.handle}</span>
                  <Ikon nama="luar" className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-gold-300">
                WhatsApp <span className="text-cream/50">{site.waTampil}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="sulur" />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} muhyi.id · {site.kota}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p>
            Powered by{' '}
            <a
              href={site.pembuat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-400 underline-offset-4 transition hover:text-gold-300 hover:underline"
            >
              {site.pembuat.nama}
            </a>
          </p>
          <Link href="/admin" className="transition hover:text-gold-300">Masuk pengelola</Link>
        </div>
      </div>
    </footer>
  );
}

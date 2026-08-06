import Link from 'next/link';
import { site, waLink } from '@/lib/site';
import Ikon, { IkonWA } from './Ikon';

export default function Hero() {
  const peranGanda = [...site.peran, ...site.peran];

  return (
    <section className="madu relative overflow-hidden bg-burgundy-950 text-cream">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 md:grid-cols-[1.1fr,0.9fr] md:gap-14">
        <div className="animate-naik">
          <p className="label text-gold-400">{site.kota}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Aku apa adanya
            <span className="block text-gold-400">saja.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream/80 sm:text-lg">
            {site.jabatan}. Halaman ini tempat saya menaruh kabar, gagasan, dan catatan pengabdian —
            sekaligus pintu bagi warga yang ingin menitipkan aspirasi.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/aspirasi" className="tombol-emas">
              Kirim aspirasi <Ikon nama="panah" className="h-4 w-4" />
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-5 py-3 font-semibold text-cream transition hover:border-gold-500/60 hover:bg-white/5"
            >
              <IkonWA className="h-5 w-5" /> {site.waTampil}
            </a>
          </div>
        </div>

        {/* Bingkai gerbang — tanda tangan visual halaman */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="gerbang relative overflow-hidden border border-gold-500/45 bg-burgundy-900 shadow-arch">
            <div className="aspect-[4/5] w-full">
              {/* Ganti dengan foto asli: taruh di /public/foto-muhyi.jpg */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/foto-muhyi.jpg"
                alt={site.namaLengkap}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-2xl font-semibold text-cream">{site.namaLengkap}</p>
              <p className="text-sm text-gold-300">{site.jabatan}</p>
            </div>
          </div>
          <div className="gerbang pointer-events-none absolute -inset-3 -z-10 border border-gold-500/20" />
        </div>
      </div>

      {/* Ticker peran */}
      <div className="border-y border-gold-500/20 bg-burgundy-900/60 py-3">
        <div className="flex w-max animate-geser gap-8 whitespace-nowrap will-change-transform">
          {peranGanda.map((p, i) => (
            <span key={i} className="label flex items-center gap-3 text-gold-300/85">
              <Ikon nama="cek" className="h-3.5 w-3.5" />
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ambilSatu, ambilKoleksi } from '@/lib/data';
import { tanggalID, domainDari, potong } from '@/lib/util';
import { site } from '@/lib/site';
import Ikon from '@/components/Ikon';
import KartuBerita from '@/components/KartuBerita';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const b = await ambilSatu('berita', params.slug);
  if (!b) return { title: 'Kabar tidak ditemukan' };
  const deskripsi = potong(b.ringkasan || b.isi?.replace(/<[^>]+>/g, '') || site.deskripsi, 180);
  const gambar = b.gambar || '/og.png';
  return {
    title: b.judul,
    description: deskripsi,
    alternates: { canonical: `/berita/${b.slug}` },
    openGraph: {
      type: 'article',
      title: b.judul,
      description: deskripsi,
      url: `${site.domain}/berita/${b.slug}`,
      siteName: site.nama,
      publishedTime: b.tanggal,
      images: [{ url: gambar, width: 1200, height: 630, alt: b.judul }],
    },
    twitter: { card: 'summary_large_image', title: b.judul, description: deskripsi, images: [gambar] },
  };
}

export default async function DetailBerita({ params }) {
  const b = await ambilSatu('berita', params.slug);
  if (!b) notFound();

  const lain = (await ambilKoleksi('berita', { batas: 4 })).filter((x) => x.slug !== b.slug).slice(0, 3);
  const luar = b.sumberJenis === 'luar' && b.sumberUrl;
  const sumber = b.sumberNama || domainDari(b.sumberUrl || '');

  return (
    <article>
      <header className="madu bg-burgundy-950 text-cream">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <Link href="/berita" className="label inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300">
            ← Semua kabar
          </Link>
          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {b.judul}
          </h1>
          <p className="mt-4 text-sm text-cream/65">
            {tanggalID(b.tanggal)}
            {b.kategori ? ` · ${b.kategori}` : ''}
            {luar ? ` · dikutip dari ${sumber}` : ''}
          </p>
        </div>
        <div className="sulur" />
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12">
        {b.gambar && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={b.gambar} alt="" className="gerbang-kecil mb-8 w-full object-cover" />
        )}

        {b.ringkasan && (
          <p className="mb-8 border-l-4 border-gold-500 pl-4 font-display text-xl leading-relaxed text-burgundy-900">
            {b.ringkasan}
          </p>
        )}

        <div className="prosa text-ink/85" dangerouslySetInnerHTML={{ __html: b.isi || '' }} />

        {luar && (
          <a
            href={b.sumberUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="gerbang-kecil mt-10 flex items-center justify-between gap-4 border border-gold-500/50 bg-gold-200/40 p-5 transition hover:bg-gold-300/50"
          >
            <span>
              <span className="label block text-burgundy-600">Sumber asli</span>
              <span className="mt-1 block font-display text-lg font-semibold text-burgundy-950">{sumber}</span>
              <span className="mt-0.5 block break-all text-xs text-ink/55">{b.sumberUrl}</span>
            </span>
            <Ikon nama="luar" className="h-6 w-6 shrink-0 text-burgundy-700" />
          </a>
        )}
      </div>

      {lain.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="sulur mb-10" />
          <h2 className="label text-burgundy-600">Kabar lain</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lain.map((x) => <KartuBerita key={x.id} berita={x} />)}
          </div>
        </section>
      )}
    </article>
  );
}

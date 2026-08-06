import Link from 'next/link';
import { tanggalID, domainDari } from '@/lib/util';
import Ikon from './Ikon';

export default function KartuBerita({ berita, utama = false }) {
  const luar = berita.sumberJenis === 'luar';
  const sumber = berita.sumberNama || domainDari(berita.sumberUrl || '');

  return (
    <article className={`kartu gerbang-kecil overflow-hidden ${utama ? 'sm:col-span-2' : ''}`}>
      <Link href={`/berita/${berita.slug}`} className="block">
        <div className={`relative overflow-hidden bg-burgundy-900 ${utama ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
          {berita.gambar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={berita.gambar}
              alt=""
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="madu flex h-full w-full items-center justify-center bg-burgundy-900">
              <span className="font-display text-3xl text-gold-500/40">muhyi.id</span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-burgundy-950/85 px-2.5 py-1 text-[.65rem] font-bold uppercase tracking-widest text-gold-300">
            {luar ? 'Dari media' : 'Kabar sendiri'}
          </span>
        </div>

        <div className="p-5">
          <p className="label text-burgundy-600">
            {tanggalID(berita.tanggal)}
            {berita.kategori ? ` · ${berita.kategori}` : ''}
          </p>
          <h3 className={`mt-2 font-display font-semibold leading-snug text-burgundy-950 ${utama ? 'text-2xl' : 'text-lg'}`}>
            {berita.judul}
          </h3>
          {berita.ringkasan && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{berita.ringkasan}</p>
          )}
        </div>
      </Link>

      {luar && berita.sumberUrl && (
        <a
          href={berita.sumberUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center gap-1.5 border-t border-burgundy-950/10 bg-gold-200/40 px-5 py-3 text-xs font-bold text-burgundy-800 transition hover:bg-gold-300/60"
        >
          <Ikon nama="luar" className="h-3.5 w-3.5" />
          Baca di {sumber}
        </a>
      )}
    </article>
  );
}

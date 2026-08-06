import Link from 'next/link';
import Hero from '@/components/Hero';
import JudulBagian from '@/components/JudulBagian';
import KartuBerita from '@/components/KartuBerita';
import Ikon from '@/components/Ikon';
import { ambilKoleksi } from '@/lib/data';
import { site } from '@/lib/site';
import { tanggalID } from '@/lib/util';

export const revalidate = 60;

export default async function Beranda() {
  const [berita, gagasan, pengabdian, event] = await Promise.all([
    ambilKoleksi('berita', { batas: 5 }),
    ambilKoleksi('gagasan', { batas: 3 }),
    ambilKoleksi('pengabdian', { batas: 4 }),
    ambilKoleksi('event', { batas: 3 }),
  ]);

  return (
    <>
      <Hero />

      {/* Kabar */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <JudulBagian
            eyebrow="Kabar terbaru"
            judul="Yang sedang berjalan"
            ket="Catatan kegiatan sendiri dan liputan media yang memuat tautan ke sumber aslinya."
          />
          <Link href="/berita" className="inline-flex items-center gap-1.5 font-semibold text-burgundy-700 hover:text-burgundy-950">
            Semua kabar <Ikon nama="panah" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {berita.map((b, i) => (
            <KartuBerita key={b.id} berita={b} utama={i === 0} />
          ))}
        </div>
        {berita.length === 0 && (
          <p className="mt-10 rounded-xl border border-dashed border-burgundy-950/20 p-8 text-center text-ink/60">
            Belum ada kabar yang terbit. Tambahkan lewat halaman pengelola.
          </p>
        )}
      </section>

      {/* Gagasan */}
      <section className="madu bg-burgundy-950 py-16 text-cream">
        <div className="mx-auto max-w-6xl px-4">
          <JudulBagian
            terang
            eyebrow="Gagasan"
            judul="Yang saya perjuangkan"
            ket="Bukan janji panjang. Beberapa hal sederhana yang bisa dikerjakan dan diukur hasilnya."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {gagasan.map((g) => (
              <Link
                key={g.id}
                href={`/gagasan#${g.slug || g.id}`}
                className="gerbang-kecil group border border-gold-500/25 bg-burgundy-900/60 p-6 transition hover:border-gold-500/60 hover:bg-burgundy-900"
              >
                <p className="label text-gold-400">{g.bidang}</p>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug">{g.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{g.ringkasan}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
                  Baca <Ikon nama="panah" className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pengabdian */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <JudulBagian
          eyebrow="Pengabdian"
          judul="Jejak yang bisa ditanyakan ke warga"
          ket="Daftar ini bukan penghargaan, melainkan pekerjaan yang orang lain ikut menyaksikan."
        />
        <ul className="mt-10 divide-y divide-burgundy-950/10 border-y border-burgundy-950/10">
          {pengabdian.map((p) => (
            <li key={p.id} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="label w-40 shrink-0 text-burgundy-600">{p.periode}</span>
              <div>
                <p className="font-display text-lg font-semibold text-burgundy-950">
                  {p.judul} {p.peran && <span className="text-gold-600">· {p.peran}</span>}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{p.ringkasan}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/pengabdian" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-burgundy-700 hover:text-burgundy-950">
          Selengkapnya <Ikon nama="panah" className="h-4 w-4" />
        </Link>
      </section>

      {/* Event */}
      {event.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <JudulBagian eyebrow="Agenda" judul="Sampai jumpa di sini" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {event.map((e) => (
              <div key={e.id} className="kartu gerbang-kecil p-5">
                <p className="label text-gold-600">{tanggalID(e.tanggal)}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-burgundy-950">{e.judul}</h3>
                <p className="mt-1 text-sm text-ink/70">{e.lokasi}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ajakan aspirasi */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="gerbang overflow-hidden border border-gold-500/40 bg-gradient-to-br from-burgundy-800 to-burgundy-950 px-6 py-14 text-center text-cream">
          <p className="label text-gold-400">Kirim aspirasi</p>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Ada yang mengganjal di kampung sampeyan?
          </h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-cream/75">
            Tulis di sini. Setiap masukan dibaca, dicatat, dan sebisanya ditindaklanjuti bersama warga.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/aspirasi" className="tombol-emas">Tulis aspirasi</Link>
            <Link href="/kontak" className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-5 py-3 font-semibold transition hover:bg-white/5">
              Cara lain menghubungi
            </Link>
          </div>
          <div className="sulur mx-auto mt-10 max-w-xs" />
          <p className="mt-6 font-display text-lg italic text-gold-300">.. {site.slogan} ..</p>
        </div>
      </section>
    </>
  );
}

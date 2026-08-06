import { site } from '@/lib/site';
import Sampul from '@/components/Sampul';
import JudulBagian from '@/components/JudulBagian';
import { ambilKoleksi } from '@/lib/data';
import Ikon from '@/components/Ikon';

export const revalidate = 300;
export const metadata = {
  title: 'Profil',
  description: `Profil ${site.namaLengkap} — ${site.jabatan}. Perjalanan, peran, dan pengalaman pribadi.`,
};

export default async function Profil() {
  const pengalaman = await ambilKoleksi('pengalaman', { batas: 30 });
  const jenis = [...new Set(pengalaman.map((p) => p.jenis || 'Lainnya'))];

  return (
    <>
      <Sampul
        eyebrow="Profil"
        judul="Orang Bangkalan yang memilih tidak jaga jarak"
        ket={site.deskripsi}
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-[1fr,1.4fr]">
        <div className="gerbang overflow-hidden border border-gold-500/40 bg-burgundy-900 shadow-arch">
          <div className="aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/foto-muhyi.jpg" alt={site.namaLengkap} className="h-full w-full object-cover object-top" />
          </div>
        </div>

        <div className="prosa text-ink/80">
          <JudulBagian eyebrow="Ringkas" judul={site.namaLengkap} />
          <p className="mt-6">
            Saya lahir dan tumbuh di {site.kota}. Kegiatan sehari-hari berputar di tiga hal: mendampingi
            warga soal layanan kesehatan, menjalankan usaha, dan mengajar diri sendiri lewat jalur akademik.
          </p>
          <p>
            Amanah yang sedang saya pegang adalah {site.jabatan}. Dari kursi itu saya belajar bahwa
            keluhan warga jarang rumit — yang rumit biasanya jalur penyelesaiannya.
          </p>
          <p className="font-display text-xl italic text-burgundy-800">.. {site.slogan} ..</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {site.peran.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-burgundy-950/15 bg-white px-3.5 py-1.5 text-sm font-semibold text-burgundy-800">
                <Ikon nama="cek" className="h-3.5 w-3.5 text-gold-600" /> {p}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {site.tautan.map((t) => (
              <div key={t.nama} className="kartu gerbang-kecil p-4">
                <p className="font-display font-semibold text-burgundy-950">{t.nama}</p>
                <p className="mt-1 text-xs text-ink/65">{t.ket}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pengalaman — dikelompokkan menurut jenis */}
      <section className="bg-white/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <JudulBagian
            eyebrow="Pengalaman"
            judul="Yang pernah dan sedang dikerjakan"
            ket="Daftar ini bisa ditambah kapan saja lewat halaman pengelola."
          />
          <div className="mt-10 space-y-10">
            {jenis.map((j) => (
              <div key={j}>
                <p className="label text-burgundy-600">{j}</p>
                <ul className="mt-4 divide-y divide-burgundy-950/10 border-y border-burgundy-950/10">
                  {pengalaman
                    .filter((p) => (p.jenis || 'Lainnya') === j)
                    .map((p) => (
                      <li key={p.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                        <span className="w-36 shrink-0 text-sm font-semibold text-gold-600">{p.periode}</span>
                        <div>
                          <p className="font-display text-lg font-semibold text-burgundy-950">{p.judul}</p>
                          {p.organisasi && <p className="text-sm text-ink/65">{p.organisasi}</p>}
                          {p.ringkasan && <p className="mt-1 text-sm leading-relaxed text-ink/70">{p.ringkasan}</p>}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

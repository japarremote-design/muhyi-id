import Sampul from '@/components/Sampul';
import { ambilKoleksi } from '@/lib/data';
import { tanggalID } from '@/lib/util';

export const revalidate = 300;
export const metadata = {
  title: 'Gagasan',
  description: 'Gagasan dan usulan konkret untuk Bangkalan: kesehatan, ekonomi desa, dan pendidikan.',
};

export default async function Gagasan() {
  const daftar = await ambilKoleksi('gagasan', { batas: 50 });

  return (
    <>
      <Sampul
        eyebrow="Gagasan"
        judul="Usulan yang bisa dikerjakan, bukan sekadar diucapkan"
        ket="Tiap gagasan ditulis singkat: apa masalahnya, apa langkahnya, dan bagaimana hasilnya diukur."
      />
      <section className="mx-auto max-w-4xl px-4 py-14">
        {daftar.length === 0 && (
          <p className="rounded-xl border border-dashed border-burgundy-950/20 p-8 text-center text-ink/60">
            Belum ada gagasan yang ditulis.
          </p>
        )}
        <div className="space-y-8">
          {daftar.map((g, i) => (
            <article key={g.id} id={g.slug || g.id} className="kartu gerbang-kecil scroll-mt-24 p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="label text-burgundy-600">{g.bidang || 'Umum'}</p>
                <span className="font-display text-3xl text-gold-300">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-burgundy-950">{g.judul}</h2>
              {g.ringkasan && <p className="mt-3 leading-relaxed text-ink/75">{g.ringkasan}</p>}
              {g.isi && (
                <div className="prosa mt-4 text-ink/75" dangerouslySetInnerHTML={{ __html: g.isi }} />
              )}
              {g.tanggal && <p className="mt-5 text-xs text-ink/50">Ditulis {tanggalID(g.tanggal)}</p>}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
